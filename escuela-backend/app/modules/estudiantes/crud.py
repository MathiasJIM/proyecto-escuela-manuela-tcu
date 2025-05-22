from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session

from app.modules.estudiantes.models import Estudiante, Matricula
from app.modules.estudiantes.schemas import EstudianteCreate, EstudianteUpdate
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate
from app.core.security import hashear_password
from app.modules.anio_lectivo.crud import get_anio_lectivo_activo
from app.core.utils import generar_correo_padre, generar_contrasena_segura


def get_estudiante(db: Session, id_estudiante: UUID) -> Optional[Estudiante]:
    return db.query(Estudiante).filter(Estudiante.id_estudiante == id_estudiante).first()


def get_estudiantes(db: Session, skip: int = 0, limit: int = 100) -> List[Estudiante]:
    # Obtener todos los estudiantes
    estudiantes = db.query(Estudiante).offset(skip).limit(limit).all()
    
    # Para cada estudiante, buscar su matrícula actual y la sección correspondiente
    from app.modules.estudiantes.models import Matricula
    from app.modules.secciones.models import Seccion
    from app.modules.anio_lectivo.crud import get_anio_lectivo_activo
    
    # Obtener el año lectivo activo
    anio_activo = get_anio_lectivo_activo(db)
    
    if anio_activo:
        for estudiante in estudiantes:
            # Buscar la matrícula del estudiante en el año activo
            matricula = db.query(Matricula).filter(
                Matricula.id_estudiante == estudiante.id_estudiante,
                Matricula.id_anio == anio_activo.id_anio
            ).first()
            
            if matricula:
                # Si tiene matrícula, buscar la información de la sección
                seccion = db.query(Seccion).filter(Seccion.id_seccion == matricula.id_seccion).first()
                if seccion:
                    # Añadir la información de la sección al objeto estudiante
                    setattr(estudiante, "seccion", seccion)
    
    return estudiantes


def get_estudiante_by_nombre(db: Session, nombre: str) -> Optional[Estudiante]:
    return db.query(Estudiante).filter(Estudiante.nombre == nombre).first()


def create_estudiante_with_padre(db: Session, estudiante: EstudianteCreate) -> tuple[Estudiante, str, str]:
    correo_padre = generar_correo_padre(estudiante.nombre, db)
    contrasena_padre = generar_contrasena_segura(correo_padre, estudiante.nombre)
    
    usuario_padre = UsuarioCreate(
        nombre=f"Padre de {estudiante.nombre}",
        correo=correo_padre,
        contrasena=contrasena_padre,
        rol="padre"
    )
    
    hashed_password = hashear_password(usuario_padre.contrasena)
    
    db_usuario = Usuario(
        nombre=usuario_padre.nombre,
        correo=usuario_padre.correo,
        contrasena_hash=hashed_password,
        rol=usuario_padre.rol
    )
    db.add(db_usuario)
    db.flush()
    
    db_estudiante = Estudiante(
        nombre=estudiante.nombre,
        id_padre=db_usuario.id_usuario
    )
    db.add(db_estudiante)
    db.flush()
    
    # Si se proporcionaron IDs de sección y año lectivo, crear matrícula
    if estudiante.id_seccion:
        # Si no se proporciona un año lectivo, usar el año activo
        id_anio = estudiante.id_anio
        if not id_anio:
            anio_activo = get_anio_lectivo_activo(db)
            if anio_activo:
                id_anio = anio_activo.id_anio
        
        if id_anio:
            db_matricula = Matricula(
                id_estudiante=db_estudiante.id_estudiante,
                id_seccion=estudiante.id_seccion,
                id_anio=id_anio
            )
            db.add(db_matricula)
    
    db.commit()
    db.refresh(db_estudiante)
    
    return db_estudiante, correo_padre, contrasena_padre


def update_estudiante(db: Session, id_estudiante: UUID, estudiante: EstudianteUpdate) -> Optional[Estudiante]:
    """Actualizar un estudiante existente y su matrícula si se proporciona una sección"""
    from app.modules.estudiantes.models import Matricula
    from app.modules.anio_lectivo.crud import get_anio_lectivo_activo
    
    db_estudiante = get_estudiante(db, id_estudiante)
    if not db_estudiante:
        return None
    
    # Actualizar los campos del estudiante (excluyendo id_seccion e id_anio que no son parte del modelo Estudiante)
    estudiante_data = estudiante.dict(exclude={"id_seccion", "id_anio"}, exclude_unset=True)
    for key, value in estudiante_data.items():
        setattr(db_estudiante, key, value)
    
    # Si se proporciona una sección, actualizar o crear la matrícula
    if estudiante.id_seccion is not None:
        # Obtener el año lectivo (usar el proporcionado o el activo)
        id_anio = estudiante.id_anio
        if not id_anio:
            anio_activo = get_anio_lectivo_activo(db)
            if anio_activo:
                id_anio = anio_activo.id_anio
        
        if id_anio:
            # Buscar si ya existe una matrícula para este estudiante en este año
            matricula = db.query(Matricula).filter(
                Matricula.id_estudiante == id_estudiante,
                Matricula.id_anio == id_anio
            ).first()
            
            if matricula:
                # Actualizar la matrícula existente
                matricula.id_seccion = estudiante.id_seccion
            else:
                # Crear una nueva matrícula
                nueva_matricula = Matricula(
                    id_estudiante=id_estudiante,
                    id_seccion=estudiante.id_seccion,
                    id_anio=id_anio
                )
                db.add(nueva_matricula)
    
    db.commit()
    db.refresh(db_estudiante)
    return db_estudiante


def delete_estudiante(db: Session, id_estudiante: UUID) -> Optional[Estudiante]:
    """Eliminar un estudiante"""
    db_estudiante = get_estudiante(db, id_estudiante)
    if not db_estudiante:
        return None
    
    db.delete(db_estudiante)
    db.commit()
    return db_estudiante

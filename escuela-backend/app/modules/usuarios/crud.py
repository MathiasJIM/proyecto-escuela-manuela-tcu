from sqlalchemy.orm import Session
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate
from app.core.security import verificar_password, hashear_password
from app.core.utils import generar_contrasena_segura
from typing import Optional, Tuple
import uuid

def obtener_usuario_por_id(session: Session, usuario_id: uuid.UUID) -> Optional[Usuario]:
    return session.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()


def obtener_usuario_por_correo(session: Session, correo: str) -> Optional[Usuario]:
    return session.query(Usuario).filter(Usuario.correo == correo).first()


def autenticar_usuario(session: Session, correo: str, contrasena: str) -> Optional[Usuario]:
    usuario = obtener_usuario_por_correo(session, correo)
    if not usuario:
        return None
    if not verificar_password(contrasena, usuario.contrasena_hash):
        return None
    return usuario


def crear_usuario(session: Session, usuario_base: UsuarioCreate) -> Tuple[Usuario, Optional[str]]:
    contrasena_generada = None
    if not usuario_base.contrasena:
        contrasena_generada = generar_contrasena_segura(usuario_base.correo, usuario_base.nombre)
        contrasena = contrasena_generada
    else:
        contrasena = usuario_base.contrasena
    
    usuario = Usuario(
        id_usuario=uuid.uuid4(),
        nombre=usuario_base.nombre,
        correo=usuario_base.correo,
        rol=usuario_base.rol,
        contrasena_hash=hashear_password(contrasena),
        activo=usuario_base.activo,
        foto=usuario_base.foto
    )
    
    session.add(usuario)
    session.flush()  

    if usuario.rol == "profesor":
        from app.modules.usuarios.models import Profesor
        profesor = Profesor(id_profesor=usuario.id_usuario)
        session.add(profesor)
    
    session.commit()
    session.refresh(usuario)
    
    return usuario, contrasena_generada


def actualizar_contrasena(session: Session, usuario_id: uuid.UUID, contrasena_actual: str, nueva_contrasena: str) -> Tuple[Usuario, bool]:
    usuario = obtener_usuario_por_id(session, usuario_id)
    if not usuario:
        return None, False
    
    if not verificar_password(contrasena_actual, usuario.contrasena_hash):
        return usuario, False
    
    usuario.contrasena_hash = hashear_password(nueva_contrasena)
    
    session.commit()
    session.refresh(usuario)
    session.commit()
    session.refresh(usuario)
    
    return usuario, True


def eliminar_usuario_por_id(session: Session, usuario_id: uuid.UUID) -> bool:
    usuario = obtener_usuario_por_id(session, usuario_id)
    if not usuario:
        return False
    session.delete(usuario)
    session.commit()
    return True
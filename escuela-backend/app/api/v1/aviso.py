from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_db, get_current_user
from app.modules.avisos import crud, schemas
from app.modules.usuarios.schemas import UsuarioOut

router = APIRouter()


@router.get("/obtener-avisos", response_model=List[schemas.Aviso])
def get_avisos(
    db: Session = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """
    Obtener lista de avisos.
    """
    return crud.get_avisos(db, skip=skip, limit=limit)


@router.get("/obtener-avisos/{destinatario}", response_model=List[schemas.Aviso])
def get_avisos_por_destinatario(
    destinatario: str,
    db: Session = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """
    Obtener avisos por destinatario (todos o para mi).
    """
    if destinatario not in ["todos", "para mi"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destinatario inválido. Debe ser 'todos' o 'para mi'"
        )
    return crud.get_avisos_por_destinatario(db, destinatario=destinatario, skip=skip, limit=limit)


@router.post("/crear-aviso", response_model=schemas.Aviso, status_code=status.HTTP_201_CREATED)
def create_aviso(
    aviso_in: schemas.AvisoCreate,
    db: Session = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    """
    Crear un nuevo aviso.
    Solo usuarios con rol 'direccion' pueden crear avisos.
    """
    if current_user.rol != "direccion":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para crear avisos"
        )
    
    return crud.create_aviso(db, aviso=aviso_in)


@router.put("/actualizar-aviso/{id_aviso}", response_model=schemas.Aviso)
def update_aviso(
    id_aviso: UUID,
    aviso_in: schemas.AvisoUpdate,
    db: Session = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    """
    Actualizar un aviso.
    Solo usuarios con rol 'direccion' pueden actualizar avisos.
    """
    if current_user.rol != "direccion":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para actualizar avisos"
        )
    
    db_aviso = crud.update_aviso(db, id_aviso=id_aviso, aviso=aviso_in)
    if db_aviso is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado"
        )
    return db_aviso


@router.delete("/eliminar-aviso/{id_aviso}", status_code=status.HTTP_204_NO_CONTENT)
def delete_aviso(
    id_aviso: UUID,
    db: Session = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    """
    Eliminar un aviso.
    Solo usuarios con rol 'direccion' pueden eliminar avisos.
    """
    if current_user.rol != "direccion":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para eliminar avisos"
        )
    
    if not crud.delete_aviso(db, id_aviso=id_aviso):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado"
        )

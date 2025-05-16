from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from app.modules.usuarios.schemas import CambioContrasenaRequest, CambioContrasenaResponse, UsuarioOut
from app.modules.usuarios.crud import actualizar_contrasena, eliminar_usuario_por_id
from app.api.v1.deps import get_db, get_current_user

router = APIRouter()

@router.post("/cambiar-contrasena", response_model=CambioContrasenaResponse)
def cambiar_contrasena(datos: CambioContrasenaRequest, db: Session = Depends(get_db), usuario_actual = Depends(get_current_user)):
    """Endpoint para cambiar la contraseña del usuario autenticado."""
    usuario, exito = actualizar_contrasena(
        session=db,
        usuario_id=usuario_actual.id_usuario,
        contrasena_actual=datos.contrasena_actual,
        nueva_contrasena=datos.nueva_contrasena
    )
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
      
    if not exito:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
    
    return {
        "mensaje": "Contraseña actualizada correctamente"
    }


@router.delete("/eliminar/{id_usuario}")
def eliminar_usuario(id_usuario: uuid.UUID, db: Session = Depends(get_db), usuario_actual = Depends(get_current_user)):
    if usuario_actual.rol != "direccion":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permisos para eliminar usuarios"
        )
    
    exito = eliminar_usuario_por_id(db, id_usuario)
    if not exito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado"
        )
    
    return {"mensaje": "Usuario eliminado correctamente"}

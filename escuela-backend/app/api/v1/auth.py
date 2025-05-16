from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.modules.usuarios.schemas import UsuarioLogin, UsuarioOut, UsuarioCreate, RegistroResponse
from app.modules.usuarios.crud import autenticar_usuario, crear_usuario, obtener_usuario_por_correo
from app.db.session import SessionLocal
from app.core.security import crear_token_acceso
from app.core.email import send_welcome_email
from app.api.v1.deps import get_db, get_current_user

router = APIRouter()

@router.post("/login")
def login(usuario_login: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db, usuario_login.correo, usuario_login.contrasena)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    
    access_token = crear_token_acceso({"sub": str(usuario.id_usuario)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UsuarioOut)
def obtener_usuario_actual(usuario_actual = Depends(get_current_user)):
    return usuario_actual


@router.post("/registrar", response_model=RegistroResponse)
async def registrar(usuario_in: UsuarioCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existente = obtener_usuario_por_correo(db, usuario_in.correo)
    if existente:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    
    usuario, contrasena_generada = crear_usuario(db, usuario_in)
    
    if usuario.rol in ["profesor", "direccion"] and contrasena_generada and usuario_in.correo:
        background_tasks.add_task(
            send_welcome_email,
            to_email=usuario.correo,
            nombre=usuario.nombre,
            password=contrasena_generada
        )
    
    return {
        "usuario": usuario,
        "contrasena_generada": contrasena_generada
    }


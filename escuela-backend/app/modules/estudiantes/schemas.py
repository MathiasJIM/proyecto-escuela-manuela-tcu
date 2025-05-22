from typing import Optional
from uuid import UUID
from datetime import date
from pydantic import BaseModel, Field


class EstudianteBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre completo del estudiante")


class EstudianteCreate(EstudianteBase):
    id_seccion: Optional[UUID] = None
    id_anio: Optional[UUID] = None


class EstudianteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100, description="Nombre completo del estudiante")
    id_seccion: Optional[UUID] = Field(None, description="ID de la sección a la que pertenece el estudiante")
    id_anio: Optional[UUID] = Field(None, description="ID del año lectivo")


class SeccionInfo(BaseModel):
    id_seccion: UUID
    nombre: str
    grado: str

    class Config:
        orm_mode = True

class Estudiante(EstudianteBase):
    id_estudiante: UUID
    id_padre: Optional[UUID] = None
    seccion: Optional[SeccionInfo] = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id_estudiante": "550e8400-e29b-41d4-a716-446655440000",
                "nombre": "Juan Pérez",
                "id_padre": "550e8400-e29b-41d4-a716-446655440001",
                "seccion": {
                    "id_seccion": "550e8400-e29b-41d4-a716-446655440002",
                    "nombre": "1-A",
                    "grado": "Primero"
                }
            }
        }


class EstudianteWithCredentials(Estudiante):
    correo_padre: str
    contrasena_padre: str
    matriculado: Optional[bool] = None
    id_seccion: Optional[UUID] = None
    id_anio: Optional[UUID] = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id_estudiante": "550e8400-e29b-41d4-a716-446655440000",
                "nombre": "Juan Pérez",
                "id_padre": "550e8400-e29b-41d4-a716-446655440001",
                "correo_padre": "jperez1234@escmanuela.ed.cr",
                "contrasena_padre": "Abc123!xy"
            }
        }


class Matricula(BaseModel):
    id_matricula: UUID
    id_estudiante: UUID
    id_seccion: UUID
    id_anio: UUID
    fecha_matricula: date

    class Config:
        orm_mode = True

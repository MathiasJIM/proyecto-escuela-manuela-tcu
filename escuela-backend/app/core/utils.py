import random
import string
import re
from typing import Optional


def generar_contrasena_segura(correo: str, nombre: Optional[str] = None) -> str:
    username = correo.split('@')[0]
    
    username_clean = re.sub(r'[^a-zA-Z0-9]', '', username)
    
    if len(username_clean) < 3 and nombre:
        nombre_clean = re.sub(r'[^a-zA-Z0-9]', '', nombre)
        username_clean = nombre_clean[:3] if len(nombre_clean) >= 3 else nombre_clean
    
    base = username_clean[:5]
    
    if base:
        pos = random.randint(0, len(base) - 1)
        base = base[:pos] + base[pos].upper() + base[pos+1:]
    
    num = str(random.randint(10, 9999))
    
    special_chars = '!@#$%^&*'
    special = random.choice(special_chars)
    
    random_letters = ''.join(random.choices(string.ascii_letters, k=2))
    
    all_parts = [base, num, special, random_letters]
    random.shuffle(all_parts)
    password = ''.join(all_parts)
    
    while len(password) < 8:
        password += random.choice(string.ascii_letters + string.digits)
    
    return password


def validar_fortaleza_contrasena(contrasena: str) -> bool:
    if len(contrasena) < 8:
        return False
    
    if not re.search(r'[A-Z]', contrasena):
        return False
    
    if not re.search(r'[0-9]', contrasena):
        return False
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', contrasena):
        return False
    
    return True

import os
import sys
import platform
import re

def get_default_log_path():
    """Obtiene la ruta por defecto del Editor.log según el sistema operativo."""
    system = platform.system()
    if system == "Windows":
        return os.path.expandvars(r"%LOCALAPPDATA%\Unity\Editor\Editor.log")
    elif system == "Darwin": # macOS
        return os.path.expanduser("~/Library/Logs/Unity/Editor.log")
    elif system == "Linux":
        return os.path.expanduser("~/.config/unity3d/Editor.log")
    else:
        return None

def parse_log(file_path, output_limit=50):
    """Extrae errores y excepciones del log."""
    if not os.path.exists(file_path):
        print(f"Error: No se encontró el archivo log en: {file_path}")
        return

    print(f"--- Analizando Unity Editor Log: {file_path} ---\n")
    
    error_pattern = re.compile(r"(Exception|Error|NullReferenceException|Assertion failed)", re.IGNORECASE)
    
    extracted_errors = []
    current_error = []
    capturing_stack = False

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    for line in lines:
        # Limpiar salto de línea
        line = line.rstrip()

        # Si encontramos una palabra clave de error, empezamos a capturar
        if error_pattern.search(line):
            if current_error: # Guardar el error anterior si existe
                extracted_errors.append("\n".join(current_error))
                current_error = []
            
            current_error.append(line)
            capturing_stack = True
            continue
        
        # Si estamos capturando el stack trace
        if capturing_stack:
            # Los stack traces en Unity suelen empezar con "  at " o rutas de archivos
            if line.strip().startswith("at ") or ".cs:" in line or "UnityEngine." in line:
                current_error.append(line)
            elif line.strip() == "":
                # Línea vacía a menudo significa fin del bloque de error
                capturing_stack = False
            else:
                # Si la línea no parece parte del stack trace, detenemos la captura
                capturing_stack = False

    # Añadir el último error capturado
    if current_error:
        extracted_errors.append("\n".join(current_error))

    # Eliminar duplicados (muy común en el log de Unity)
    unique_errors = list(dict.fromkeys(extracted_errors))

    if not unique_errors:
        print("✅ No se encontraron excepciones o errores críticos en el log analizado.")
        return

    print(f"🔥 Se encontraron {len(unique_errors)} errores únicos. Mostrando los últimos {output_limit}:\n")
    
    # Mostrar solo los últimos 'output_limit' errores para no quemar tokens de la IA
    for i, error in enumerate(unique_errors[-output_limit:], 1):
        print(f"--- ERROR {i} ---")
        print(f"{error}\n")

if __name__ == "__main__":
    # Permite pasar la ruta del log como argumento, o usa la de por defecto
    log_path = sys.argv[1] if len(sys.argv) > 1 else get_default_log_path()
    
    if log_path:
        parse_log(log_path)
    else:
        print("No se pudo determinar la ruta por defecto del log para este sistema operativo.")
        print("Uso: python parse_editor_log.py <ruta_al_archivo.log>")
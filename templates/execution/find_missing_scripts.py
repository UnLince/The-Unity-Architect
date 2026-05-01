import os
import sys

def find_missing_scripts(directory):
    print(f"--- Escaneando proyecto en busca de Missing Scripts: {directory} ---\n")
    
    # Unity guarda escenas y prefabs en formato de texto (YAML)
    target_extensions = ('.prefab', '.unity')
    missing_script_pattern = "m_Script: {fileID: 0}"
    
    files_with_missing_scripts = {}

    # Recorrer todas las carpetas del proyecto
    for root, _, files in os.walk(directory):
        # Ignorar carpetas ocultas o temporales de Unity para mayor velocidad
        if '.git' in root or 'Library' in root or 'Temp' in root or 'Logs' in root:
            continue
            
        for file in files:
            if file.endswith(target_extensions):
                file_path = os.path.join(root, file)
                missing_count = 0
                
                try:
                    # Leemos el archivo línea por línea para no saturar la RAM en escenas gigantes
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        for line in f:
                            if missing_script_pattern in line:
                                missing_count += 1
                                
                    if missing_count > 0:
                        # Guardamos la ruta relativa para que el output sea limpio
                        rel_path = os.path.relpath(file_path, directory)
                        files_with_missing_scripts[rel_path] = missing_count
                except Exception as e:
                    print(f"Error al leer: {file_path} - {e}")

    # Imprimir el reporte final para la IA o el usuario
    if not files_with_missing_scripts:
        print("✅ ¡Excelente! No se encontraron 'Missing Scripts' en los Prefabs o Escenas analizados.")
    else:
        print(f"⚠️ ¡ALERTA! Se encontraron dependencias rotas en {len(files_with_missing_scripts)} archivos:\n")
        
        # Ordenar alfabéticamente para mejor legibilidad
        for file, count in sorted(files_with_missing_scripts.items()):
            print(f"  - {file} ({count} scripts perdidos)")
            
        print("\n💡 Directiva para IA: Instruye al usuario a abrir estos archivos específicos en el Editor de Unity y limpiar los componentes huérfanos antes de continuar con la depuración del código.")

if __name__ == "__main__":
    # Si se pasa un argumento, usa esa ruta. Si no, usa el directorio actual (Assets).
    target_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    find_missing_scripts(target_dir)
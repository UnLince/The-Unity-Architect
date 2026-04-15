import os

def create_folders():
    # Root folders
    root_folders = ['directives', 'execution', '.tmp', 'docs']
    for folder in root_folders:
        os.makedirs(folder, exist_ok=True)
        print(f"Created/Verified: {folder}/")

    # Assets/_Project structure
    base_path = os.path.join('Assets', '_Project')
    project_folders = [
        'Scenes',
        'Scripts/Core',
        'Scripts/Gameplay',
        'Scripts/Characters',
        'Scripts/Net',
        'Scripts/UI',
        'Scripts/Audio',
        'Scripts/Tools',
        'Data/Abilities',
        'Data/Items',
        'Data/Buildings',
        'Data/Zones',
        'Data/Economy',
        'Prefabs',
        'Art',
        'VFX',
        'Materials',
        'Animations'
    ]

    for folder in project_folders:
        full_path = os.path.join(base_path, folder)
        os.makedirs(full_path, exist_ok=True)
        print(f"Created/Verified: {full_path}/")

if __name__ == '__main__':
    create_folders()

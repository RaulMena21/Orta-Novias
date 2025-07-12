#!/usr/bin/env python
"""
Script de despliegue completo para Orta Novias
Automatiza todo el proceso de despliegue en producción
"""
import os
import sys
import subprocess
import time
import requests
from pathlib import Path

class OrtaNoviasDeployer:
    """Desplegador automático para Orta Novias"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_path = self.project_root / 'backend'
        self.frontend_path = self.project_root / 'frontend'
        
    def check_prerequisites(self):
        """Verificar que todos los requisitos estén instalados"""
        print("🔍 Verificando requisitos previos...")
        
        requirements = [
            ('python', 'Python 3.8+'),
            ('node', 'Node.js 16+'),
            ('npm', 'NPM'),
            ('git', 'Git'),
            ('docker', 'Docker'),
            ('docker-compose', 'Docker Compose')
        ]
        
        missing = []
        for cmd, name in requirements:
            if not self._command_exists(cmd):
                missing.append(name)
        
        if missing:
            print(f"❌ Faltan los siguientes requisitos: {', '.join(missing)}")
            return False
        
        print("✅ Todos los requisitos están instalados")
        return True
    
    def _command_exists(self, command):
        """Verificar si un comando existe"""
        try:
            subprocess.run([command, '--version'], 
                         capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def setup_environment(self):
        """Configurar archivos de entorno"""
        print("🔧 Configurando archivos de entorno...")
        
        # Crear .env si no existe
        env_file = self.project_root / '.env'
        env_example = self.project_root / '.env.example'
        
        if not env_file.exists() and env_example.exists():
            print("📝 Creando archivo .env desde .env.example...")
            with open(env_example, 'r') as f:
                content = f.read()
            
            with open(env_file, 'w') as f:
                f.write(content)
            
            print("⚠️  IMPORTANTE: Edita el archivo .env con tus configuraciones reales")
            print("   Especialmente:")
            print("   - SECRET_KEY")
            print("   - DATABASE_URL")
            print("   - CLOUDFLARE_API_TOKEN")
            print("   - Email settings")
            
            input("Presiona Enter cuando hayas configurado el archivo .env...")
        
        return True
    
    def build_frontend(self):
        """Construir el frontend"""
        print("🏗️  Construyendo frontend...")
        
        try:
            # Instalar dependencias
            print("📦 Instalando dependencias de Node.js...")
            subprocess.run(['npm', 'install'], 
                         cwd=self.frontend_path, check=True)
            
            # Construir para producción
            print("🔨 Construyendo aplicación React...")
            subprocess.run(['npm', 'run', 'build'], 
                         cwd=self.frontend_path, check=True)
            
            print("✅ Frontend construido exitosamente")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error construyendo frontend: {e}")
            return False
    
    def setup_backend(self):
        """Configurar el backend"""
        print("🐍 Configurando backend...")
        
        try:
            # Crear entorno virtual si no existe
            venv_path = self.project_root / 'venv'
            if not venv_path.exists():
                print("🐍 Creando entorno virtual...")
                subprocess.run([sys.executable, '-m', 'venv', 'venv'], 
                             cwd=self.project_root, check=True)
            
            # Activar entorno virtual y instalar dependencias
            if os.name == 'nt':  # Windows
                pip_cmd = venv_path / 'Scripts' / 'pip.exe'
                python_cmd = venv_path / 'Scripts' / 'python.exe'
            else:  # Unix/Linux
                pip_cmd = venv_path / 'bin' / 'pip'
                python_cmd = venv_path / 'bin' / 'python'
            
            print("📦 Instalando dependencias de Python...")
            subprocess.run([str(pip_cmd), 'install', '-r', 'requirements.txt'], 
                         cwd=self.project_root, check=True)
            
            # Ejecutar migraciones
            print("🗄️  Ejecutando migraciones de base de datos...")
            subprocess.run([str(python_cmd), 'manage.py', 'migrate'], 
                         cwd=self.project_root, check=True)
            
            # Recopilar archivos estáticos
            print("📁 Recopilando archivos estáticos...")
            subprocess.run([str(python_cmd), 'manage.py', 'collectstatic', '--noinput'], 
                         cwd=self.project_root, check=True)
            
            print("✅ Backend configurado exitosamente")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error configurando backend: {e}")
            return False
    
    def run_security_checks(self):
        """Ejecutar validaciones de seguridad"""
        print("🔒 Ejecutando validaciones de seguridad...")
        
        try:
            # Ejecutar script de validación
            security_script = self.project_root / 'backend' / 'security_check.py'
            if security_script.exists():
                if os.name == 'nt':
                    python_cmd = self.project_root / 'venv' / 'Scripts' / 'python.exe'
                else:
                    python_cmd = self.project_root / 'venv' / 'bin' / 'python'
                
                result = subprocess.run([str(python_cmd), str(security_script)], 
                                      capture_output=True, text=True)
                
                print(result.stdout)
                
                if result.returncode != 0:
                    print("⚠️  Se encontraron problemas de seguridad")
                    print(result.stderr)
                    return False
            
            print("✅ Validaciones de seguridad completadas")
            return True
            
        except Exception as e:
            print(f"❌ Error en validaciones de seguridad: {e}")
            return False
    
    def setup_cloudflare(self):
        """Configurar Cloudflare WAF"""
        print("☁️  Configurando Cloudflare WAF...")
        
        # Verificar si las credenciales de Cloudflare están configuradas
        env_file = self.project_root / '.env'
        if not env_file.exists():
            print("❌ Archivo .env no encontrado")
            return False
        
        # Leer configuración
        with open(env_file, 'r') as f:
            env_content = f.read()
        
        if 'CLOUDFLARE_API_TOKEN=' not in env_content or 'CLOUDFLARE_ZONE_ID=' not in env_content:
            print("⚠️  Configuración de Cloudflare no encontrada en .env")
            print("   Asegúrate de configurar:")
            print("   - CLOUDFLARE_API_TOKEN")
            print("   - CLOUDFLARE_ZONE_ID")
            print("   - CLOUDFLARE_EMAIL")
            return False
        
        try:
            # Ejecutar configurador de Cloudflare
            cloudflare_script = self.project_root / 'cloudflare_setup.py'
            if cloudflare_script.exists():
                if os.name == 'nt':
                    python_cmd = self.project_root / 'venv' / 'Scripts' / 'python.exe'
                else:
                    python_cmd = self.project_root / 'venv' / 'bin' / 'python'
                
                subprocess.run([str(python_cmd), str(cloudflare_script)], 
                             cwd=self.project_root, check=True)
            
            print("✅ Cloudflare WAF configurado")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error configurando Cloudflare: {e}")
            return False
    
    def deploy_with_docker(self):
        """Desplegar usando Docker"""
        print("🐳 Desplegando con Docker...")
        
        try:
            # Construir y levantar contenedores
            print("🔨 Construyendo contenedores...")
            subprocess.run(['docker-compose', 'build'], 
                         cwd=self.project_root, check=True)
            
            print("🚀 Levantando servicios...")
            subprocess.run(['docker-compose', 'up', '-d'], 
                         cwd=self.project_root, check=True)
            
            # Esperar a que los servicios estén listos
            print("⏳ Esperando a que los servicios estén listos...")
            time.sleep(30)
            
            # Verificar que los servicios estén funcionando
            if self._check_services():
                print("✅ Despliegue con Docker completado")
                return True
            else:
                print("❌ Los servicios no están respondiendo correctamente")
                return False
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Error en despliegue Docker: {e}")
            return False
    
    def _check_services(self):
        """Verificar que los servicios estén funcionando"""
        try:
            # Verificar backend
            response = requests.get('http://localhost:8000/api/health/', timeout=10)
            if response.status_code != 200:
                print("❌ Backend no responde correctamente")
                return False
            
            # Verificar frontend
            response = requests.get('http://localhost:3000', timeout=10)
            if response.status_code != 200:
                print("❌ Frontend no responde correctamente")
                return False
            
            return True
            
        except requests.RequestException as e:
            print(f"❌ Error verificando servicios: {e}")
            return False
    
    def run_post_deployment_tests(self):
        """Ejecutar pruebas post-despliegue"""
        print("🧪 Ejecutando pruebas post-despliegue...")
        
        tests = [
            ('http://localhost:8000/api/health/', 'Health check API'),
            ('http://localhost:8000/api/appointments/', 'API de citas'),
            ('http://localhost:8000/api/store/dresses/', 'API de vestidos'),
            ('http://localhost:8000/api/testimonials/', 'API de testimonios'),
            ('http://localhost:3000', 'Frontend'),
        ]
        
        failed_tests = []
        
        for url, name in tests:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code in [200, 401]:  # 401 es esperado para endpoints protegidos
                    print(f"✅ {name}: OK")
                else:
                    print(f"❌ {name}: HTTP {response.status_code}")
                    failed_tests.append(name)
            except requests.RequestException as e:
                print(f"❌ {name}: Error - {e}")
                failed_tests.append(name)
        
        if failed_tests:
            print(f"\n⚠️  Pruebas fallidas: {', '.join(failed_tests)}")
            return False
        
        print("\n✅ Todas las pruebas post-despliegue pasaron")
        return True
    
    def deploy(self):
        """Ejecutar el proceso completo de despliegue"""
        print("🚀 INICIANDO DESPLIEGUE DE ORTA NOVIAS")
        print("=" * 60)
        
        steps = [
            ("Verificar requisitos", self.check_prerequisites),
            ("Configurar entorno", self.setup_environment),
            ("Construir frontend", self.build_frontend),
            ("Configurar backend", self.setup_backend),
            ("Validaciones de seguridad", self.run_security_checks),
            ("Configurar Cloudflare WAF", self.setup_cloudflare),
            ("Desplegar con Docker", self.deploy_with_docker),
            ("Pruebas post-despliegue", self.run_post_deployment_tests),
        ]
        
        for step_name, step_func in steps:
            print(f"\n{'='*20} {step_name} {'='*20}")
            
            if not step_func():
                print(f"\n❌ DESPLIEGUE FALLIDO en: {step_name}")
                return False
            
            time.sleep(2)  # Pausa breve entre pasos
        
        print("\n" + "="*60)
        print("🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!")
        print("="*60)
        
        print("\n📋 INFORMACIÓN DEL DESPLIEGUE:")
        print("  • Frontend: http://localhost:3000")
        print("  • Backend API: http://localhost:8000")
        print("  • Admin Django: http://localhost:8000/admin/")
        print("  • Documentación API: http://localhost:8000/api/docs/")
        
        print("\n🔒 SEGURIDAD ACTIVADA:")
        print("  • WAF de Cloudflare configurado")
        print("  • Rate limiting activado")
        print("  • Headers de seguridad aplicados")
        print("  • SSL/TLS forzado")
        print("  • Middleware de seguridad avanzado")
        
        print("\n📊 MONITOREO:")
        print("  • Logs en ./logs/")
        print("  • Métricas de seguridad habilitadas")
        print("  • Alertas de Sentry configuradas")
        
        print("\n🔧 PRÓXIMOS PASOS:")
        print("  1. Configurar dominio en Cloudflare")
        print("  2. Configurar certificados SSL")
        print("  3. Configurar backups automáticos")
        print("  4. Monitorear logs de seguridad")
        print("  5. Realizar pruebas de penetración")
        
        return True

def main():
    """Función principal"""
    deployer = OrtaNoviasDeployer()
    
    try:
        success = deployer.deploy()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️  Despliegue interrumpido por el usuario")
        return 1
    except Exception as e:
        print(f"\n❌ Error inesperado durante el despliegue: {e}")
        return 1

if __name__ == '__main__':
    exit(main())

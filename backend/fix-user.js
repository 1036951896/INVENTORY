const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixUser() {
  try {
    const email = 'santis3268@gmail.com';
    const plainPassword = 'S3116579677';
    const nombre = 'Santis';

    // Hashear la contraseña con 10 rounds (igual que en el backend)
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log('🔍 Buscando usuario...');
    
    // Buscar si el usuario existe
    const userExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (userExistente) {
      console.log('✏️  Usuario existe. Actualizando contraseña...');
      
      const userActualizado = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          nombre: nombre,
          rol: 'CLIENTE',
          activo: true
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
          createdAt: true
        }
      });

      console.log('✅ Usuario actualizado exitosamente:');
      console.log(JSON.stringify(userActualizado, null, 2));
    } else {
      console.log('➕ Usuario no existe. Creando nuevo usuario...');
      
      const userNuevo = await prisma.user.create({
        data: {
          nombre: nombre,
          email: email,
          password: hashedPassword,
          rol: 'CLIENTE',
          activo: true
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
          createdAt: true
        }
      });

      console.log('✅ Usuario creado exitosamente:');
      console.log(JSON.stringify(userNuevo, null, 2));
    }

    console.log('\n📋 Detalles de acceso:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${plainPassword}`);
    console.log(`   Rol: CLIENTE`);
    console.log('\n✨ Ahora puedes iniciar sesión en la aplicación');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixUser();

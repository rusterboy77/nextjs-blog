import { test, expect } from "@playwright/test";

// Le damos un nombre a nuestra prueba
test("El formulario de la Terminal Neón registra un operador correctamente", async ({
  page,
}) => {
  // 1. Navegar a tu página local
  await page.goto("http://localhost:3000");

  // 2. Esperar a que el título de la página sea correcto para saber que cargó
  await expect(page).toHaveTitle("Terminal Neón");

  // 3. Generar un nombre de usuario aleatorio para que la prueba no falle
  // si la ejecutamos varias veces (recuerda que el nombre en MySQL debe ser único)
  const randomId = Math.floor(Math.random() * 10000);
  const testUser = `TEST-OP-${randomId}`;

  // 4. Escribir en los inputs usando sus IDs
  await page.fill("#user_id", testUser);
  await page.fill("#encryption_key", "clave_secreta_robot");

  // 5. Hacer clic en el botón de envío
  // Buscamos el botón por el texto que contiene
  await page.click('button:has-text("Inicializar Enlace")');

  // 6. Comprobar que aparece el mensaje de éxito en la pantalla
  // Buscamos un elemento de texto que contenga parte del mensaje
  const mensajeExito = page.locator(
    `text=¡Enlace establecido! Operador ${testUser} registrado.`,
  );

  // Le decimos a Playwright que la prueba solo es exitosa si este mensaje es visible
  await expect(mensajeExito).toBeVisible();
});

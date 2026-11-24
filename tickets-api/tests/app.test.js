const { describe, it } = require('node:test');
const assert = require('node:assert');

function validarTicket(asunto) {
  if (!asunto) return "El título es obligatorio";
  if (asunto.length < 5) return "El asunto debe tener mínimo 5 caracteres";
  return null;
}
function generarNum(ultimoNum) {
  let next = 1;
  if (ultimoNum) next = (parseInt(ultimoNum.replace('#','')) || 0) + 1;
  return '#' + String(next).padStart(4, '0');
}
function validarLogin(email, pass, userEnBD) {
  if (!userEnBD) return "Incorrecto - usuario no existe";
  if (String(userEnBD.pass).trim() !== String(pass).trim()) return "Incorrecto - contraseña incorrecta";
  return null;
}

describe('HelpDesk ITESZ - CI Testing', () => {
  it('1 - Login correcto con chris@test.com / 123', () => {
    const user = { email: 'chris@test.com', pass: '123' };
    assert.strictEqual(validarLogin('chris@test.com', '123', user), null);
  });
  it('2 - Login incorrecto rechaza contraseña mala', () => {
    const user = { email: 'chris@test.com', pass: '123' };
    assert.strictEqual(validarLogin('chris@test.com', 'mal', user), "Incorrecto - contraseña incorrecta");
  });
  it('3 - Crear ticket rechaza asunto menor a 5 caracteres', () => {
    assert.strictEqual(validarTicket('PC'), "El asunto debe tener mínimo 5 caracteres");
    assert.strictEqual(validarTicket('No enciende PC del Lab 3'), null);
  });
  it('4 - Generar número de ticket consecutivo #0001 -> #0002', () => {
    assert.strictEqual(generarNum('#0001'), '#0002');
    assert.strictEqual(generarNum(null), '#0001');
  });
});
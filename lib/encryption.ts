import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const keyHex = process.env.DNI_ENCRYPTION_KEY
  if (!keyHex) {
    throw new Error('DNI_ENCRYPTION_KEY no está configurada en las variables de entorno')
  }
  const buf = Buffer.from(keyHex, 'hex')
  if (buf.length !== 32) {
    throw new Error('DNI_ENCRYPTION_KEY debe ser 32 bytes en hexadecimal (64 caracteres hex)')
  }
  return buf
}

/**
 * Cifra un buffer con AES-256-GCM.
 * Devuelve una cadena compacta: base64(iv):base64(authTag):base64(ciphertext)
 */
export function encrypt(plainBuffer: Buffer): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plainBuffer), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}

/**
 * Descifra una cadena producida por `encrypt`.
 * Lanza si el formato es inválido o la clave/tag no coinciden.
 */
export function decrypt(encryptedString: string): Buffer {
  const key = getKey()
  const parts = encryptedString.split(':')
  if (parts.length !== 3) {
    throw new Error('Formato de datos cifrados inválido')
  }
  const [ivB64, authTagB64, ciphertextB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(authTagB64, 'base64')
  const ciphertext = Buffer.from(ciphertextB64, 'base64')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}

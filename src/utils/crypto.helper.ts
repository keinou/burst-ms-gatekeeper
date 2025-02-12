import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

export class CryptoHelper {

  configService: ConfigService
  certPath: string;
  certFile: string;
  privFile: string;
  certFull: Buffer;
  privFull: Buffer;

  constructor({ configService }) {
    this.configService = configService
    this.certPath = this.configService.get<string>('CERT_DIR', './certs/');
    this.certFile = this.configService.get<string>('CERT_FILE', 'cert.pem');
    this.privFile = this.configService.get<string>('CERT_KEY', 'dkey.pem');
    this.certFull = fs.readFileSync(path.join(this.certPath, this.certFile));
    this.privFull = fs.readFileSync(path.join(this.certPath, this.privFile));
  }

  getPublicKey(): string | Buffer {
    const cert = new crypto.X509Certificate(this.certFull);
    const publicKey = cert.publicKey

    return publicKey.export({ format: 'pem', type: 'spki' })
  }

  decryptData(data: string) {
    const arrayBuffer = Buffer.from(data, 'base64');
    const arrayBufferView = new Uint8Array(arrayBuffer);

    const privateKey = crypto.createPrivateKey(this.privFull);
    return crypto.privateDecrypt(privateKey, arrayBufferView).toString();
  }

  encryptData(data: string) {
    const encoder = new TextEncoder();
    const arrayBuffer = encoder.encode(data).buffer;
    const arrayBufferView = new Uint8Array(arrayBuffer);

    const securityCredential = crypto.publicEncrypt(this.getPublicKey(), arrayBufferView);
    return securityCredential.toString('base64')
  }
}
export class DocumentValidator {
  static onlyDigits(value: string) {
    return value.replace(/\D/g, '');
  }

  // CPF
  static isValidCPF(input: string): boolean {
    const cpf = this.onlyDigits(input);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calcDigit = (base: string, factor: number) => {
      let total = 0;

      for (let i = 0; i < base.length; i++) {
        total += Number(base[i]) * (factor - i);
      }

      const mod = total % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const d1 = calcDigit(cpf.slice(0, 9), 10);
    const d2 = calcDigit(cpf.slice(0, 10), 11);

    return cpf === cpf.slice(0, 9) + String(d1) + String(d2);
  }

  // Documento estrangeiro
  static normalizeForeignDoc(doc: string) {
    return doc.trim().toUpperCase();
  }

  static isValidForeignDoc(doc: string): boolean {
    const value = this.normalizeForeignDoc(doc);

    // regra clara pro README
    return /^[A-Z0-9-]{6,20}$/.test(value);
  }
}

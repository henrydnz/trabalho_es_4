package org.example.utils;

import org.example.models.pessoa.Email;
import org.example.models.pessoa.EnderecoEspecifico;
import org.example.models.pessoa.Telefone;

import java.util.List;

public class Utils {

    public static String formatarStrNum(String strNum) {
        if (strNum == null)
            return null;
        return strNum.replaceAll("[^0-9]", "");
    }
    public static String formatarStrSv(String strSv) {
        if (strSv == null)
            return null;
        return strSv.trim();
    }

    public static String formatarStr(String str) {
        if (str == null)
            return null;
        return str.trim().toUpperCase();
    }

    public static boolean verificarTelefones(List<Telefone> telefones) {
        if (telefones == null || telefones.isEmpty()) {
            return false;
        }

        for (Telefone telefone : telefones) {
            if (telefone == null
                    || telefone.getNroFone() == null
                    || telefone.getNroDDD() == null
                    || telefone.getNroDDI() == null) {
                return false;
            }

            String fone = telefone.getNroFone().trim();
            String ddd = telefone.getNroDDD().getNroDDD().trim();
            String ddi = telefone.getNroDDI().getNroDDI().trim();

            if (!fone.matches("\\d{8,9}") || !ddd.matches("\\d{2}") || !ddi.matches("\\d{1,3}")) {
                return false;
            }
        }
        return true;
    }

    public static boolean verificarEmails(List<Email> emails) {
        if (emails == null || emails.isEmpty()) {
            return false;
        }

        for (Email email : emails) {
            if (email == null || email.getEmail() == null) {
                return false;
            }

            String enderecoEmail = email.getEmail().trim();
            if (!enderecoEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return false;
            }
        }
        return true;
    }

    public static boolean verificarDocumento(Boolean isFisica, String documento) {
        if (isFisica == null || documento == null) {
            return false;
        }

        String docLimpo = documento.trim();
        if (isFisica) {
            return docLimpo.matches("\\d{11}");
        }
        return docLimpo.matches("\\d{14}");
    }

    public static boolean verificarEnderecoEspecifico(EnderecoEspecifico endereco) {
        if (endereco == null
                || endereco.getNumeroEndereco() == null
                || endereco.getNumeroEndereco().isBlank()
                || endereco.getNumeroEndereco().trim().length() > 14) {
            return false;
        }

        return endereco.getComplemento() == null || endereco.getComplemento().length() <= 99;
    }

    public static boolean verificarNome(Boolean isFisica, String nome) {
        if (isFisica == null || nome == null || nome.isBlank()) {
            return false;
        }

        if (isFisica) {
            return nome.trim().matches("[\\p{L}\\s]+");
        }
        return true;
    }
}

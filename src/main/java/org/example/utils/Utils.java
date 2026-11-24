package org.example.utils;

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
}

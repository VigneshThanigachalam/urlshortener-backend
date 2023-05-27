import validUrl from "valid-url";

export const validateUrl = (value) => {
    if (validUrl.isUri(value)) {
        return true;
    } else {
        return false;
    }
}
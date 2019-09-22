export const STORAGE = {
    profileName: {
        key: "profileName",
        getValue: function () {
            return sessionStorage.getItem(this.key);
        },
        setValue: function (value) {
            return sessionStorage.setItem(this.key, value)
        }
    },
    userName: {
        key: "userName",
        getValue: function () {
            return localStorage.getItem(this.key);
        },
        setValue: function (value) {
            return localStorage.setItem(this.key, value)
        }
    }
};
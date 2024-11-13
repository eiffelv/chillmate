const FormEnabler = {
    isEnabled: false,

    toggleEnable() {
        this.isEnabled = true;
        document.querySelectorAll('input').forEach(input => input.disabled = false);
        document.querySelector('button').disabled = false;
        if (document.querySelector('select')) {
            document.querySelector('select').disabled = false;
        }
    },

    toggleDisable() {
        this.isEnabled = false;
        document.querySelectorAll('input').forEach(input => input.disabled = true);
        document.querySelector('button').disabled = true;
        if (document.querySelector('select')) {
            document.querySelector('select').disabled = true;
        }
    }

};

export default FormEnabler;
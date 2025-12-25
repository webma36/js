
alert("injected");

(function () {

    // ===== FULL REPLACEMENT RESPONSE (USED FOR BOTH APIS) =====
    const FIXED_RESPONSE = {
        "OperationStatus": true,
        "AdditionalData": null,
        "MessageType": 0,
        "Message": "",
        "OperationCompleted": false
    };

    const TARGET_URLS = [
        "Registry/registry/validateRegistry",
        "mutation/dashboard/getValidationMessages"
    ];

    // ===== XMLHttpRequest OVERRIDE =====
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function () {
        const xhr = this;

        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState !== 4) return;
            if (!xhr.responseURL) return;

            if (TARGET_URLS.some(u => xhr.responseURL.includes(u))) {
                try {
                    Object.defineProperty(xhr, "responseText", {
                        configurable: true,
                        value: JSON.stringify(FIXED_RESPONSE)
                    });

                    Object.defineProperty(xhr, "response", {
                        configurable: true,
                        value: JSON.stringify(FIXED_RESPONSE)
                    });

                    console.log("✅ Response replaced for:", xhr.responseURL);
                } catch (e) {
                    console.error("❌ Override failed for:", xhr.responseURL, e);
                }
            }
        });

        return originalSend.apply(this, arguments);
    };


})();

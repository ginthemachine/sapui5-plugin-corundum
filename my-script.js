(() => {
    // show pop up
    // Add bubble to the top of the page.
    const bubbleDOM = document.createElement('div');
    bubbleDOM.setAttribute('class', 'selection_bubble');
    document.body.appendChild(bubbleDOM);
    bubbleDOM.innerHTML = "";
    bubbleDOM.style.top = '10px';
    bubbleDOM.style.left = '10px';
    bubbleDOM.style.height = '100px';
    bubbleDOM.style.backgroundColor = 'yellow';
    bubbleDOM.style.position = 'absolute';
    bubbleDOM.style.zIndex = 9999;
    bubbleDOM.style.visibility = 'visible';

    // enable this from the background.js
    document.getElementsByTagName('body')[0].addEventListener('click', function (e) {
        console.log("its loaded");

        const targetID = e.target.closest("[data-sap-ui]")?.dataset?.sapUi;
        console.log(targetID);

        if (window?.sap?.ui) {
            const el = sap.ui.getCore().byId(targetID);
            let content = "";

            console.log(el);

            if (!el) return;

            if (el?.mBindingInfos) {
                const props = Object.keys(el.mBindingInfos);
                props.forEach((item) => {
                    if ('getValue' in el.getBindingInfo(item).binding) {
                        console.log(item, el.getBindingInfo(item).binding.getValue());
                        content += "<div>" + item + " " + el.getBindingInfo(item).binding.getValue() + "</div>";
                    }
                })
            }

            // update the screen
            bubbleDOM.innerHTML = content;

            const rect = el.getDomRef().getBoundingClientRect();
            const x = e.clientX - rect.left; //x position within the element.
            const y = e.clientY - rect.top;  //y position within the element.

            // TODO: fix this
            bubbleDOM.style.top = y + 'px';
            bubbleDOM.style.left = x + 'px';
        }
    });
})();
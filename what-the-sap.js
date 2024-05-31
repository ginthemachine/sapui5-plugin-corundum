(() => {
    // show pop up
    // Add bubble to the top of the page.
    const bubbleDOM = document.createElement('div');
    const PLUGIN_PREFIX = 'what-the-sap';

    function createPopover() {
        bubbleDOM.setAttribute('class', `${PLUGIN_PREFIX}-popover`);
        bubbleDOM.setAttribute('id', `${PLUGIN_PREFIX}-popover`);
        document.body.appendChild(bubbleDOM);
    }

    function createTable() {
        const table = document.createElement('TABLE');

        // create table headers
        const headers = ['Property', 'Value'];
        const tableHead = document.createElement('THEAD');

        const trHeader = document.createElement('TR');
        trHeader.setAttribute('class', `${PLUGIN_PREFIX}-tr-header`);
        // Append the rows to the head
        tableHead.appendChild(trHeader);

        for (const element of headers) {
            // Create the rows
            const th = document.createElement('TH');
            th.setAttribute('class', `${PLUGIN_PREFIX}-th`);
            th.innerHTML = element;
            // Append them to the rows
            trHeader.appendChild(th);
        }

        // Append the table head to the table
        table.appendChild(tableHead);

        return table;
    }

    // enable this from the background.js
    document
        .getElementsByTagName('body')[0]
        .addEventListener('click', function (e) {
            const popover = document.getElementById('what-the-sap-popover');

            // insert only once
            if (!popover) {
                createPopover();
                makeItDraggable();
            }

            const targetID = e.target.closest('[data-sap-ui]')?.dataset?.sapUi;

            if (window?.sap?.ui) {
                const el = sap.ui.getCore().byId(targetID);
                const table = createTable();

                if (!el) return; // hard stop

                // create id row
                const trId = document.createElement('TR');
                trId.setAttribute('class', `${PLUGIN_PREFIX}-tr`);

                const td1 = document.createElement('TD');
                td1.innerHTML = 'ID';
                trId.appendChild(td1);

                const td = document.createElement('TD');
                td.setAttribute('class', `${PLUGIN_PREFIX}-td`);
                td.innerHTML = el.getId();
                trId.appendChild(td);

                // Create a table-body
                const tableBody = document.createElement('TBODY');

                // Append the rows to the body
                tableBody.appendChild(trId);

                // Append the table body to the table
                table.appendChild(tableBody);

                const bindings = [];

                if (el?.mBindingInfos) {
                    const props = Object.keys(el.mBindingInfos);
                    props.forEach((item) => {
                        if ('getValue' in el.getBindingInfo(item).binding) {
                            const value = el
                                .getBindingInfo(item)
                                .binding.getValue();

                            bindings.push({ item, value });
                        }
                    });
                }

                // append rows
                if (bindings.length) {
                    for (const { item, value } of bindings) {
                        // Create the rows
                        const trRow = document.createElement('TR');

                        // Create the cells
                        const tdCol = document.createElement('TD');
                        tdCol.innerHTML = `${item} binding`;
                        trRow.appendChild(tdCol);

                        // Create the cells
                        const tdCol2 = document.createElement('TD');
                        tdCol2.innerHTML = value;
                        trRow.appendChild(tdCol2);

                        tableBody.appendChild(trRow);
                    }
                }

                // update the screen
                if (bubbleDOM.hasChildNodes()) {
                    bubbleDOM.removeChild(bubbleDOM.children[0]);
                }

                bubbleDOM.appendChild(table);

                // Append index on items of "Select / Combo Box" control.
                // 1. Check State
                if (
                    el.getMetadata().getName() !== 'sap.m.Select' ||
                    el.getDomRef().closest("[id$='ElementPropertyDialog']") ===
                    null ||
                    el.getSelectedItem().getText().includes('].') ||
                    !el.getEnabled()
                )
                    return;

                // 2. Append Sequence number
                el.getAggregation('items').forEach((item, idx) => {
                    item.setText(`${item.getText()} - [${idx}].`);
                });
            }
        });

    function makeItDraggable() {
        const draggable = document.getElementById(`${PLUGIN_PREFIX}-popover`);

        let posX = 0,
            posY = 0,
            mouseX = 0,
            mouseY = 0;

        draggable.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

        function mouseDown(e) {
            e.preventDefault();
            posX = e.clientX - draggable.offsetLeft;
            posY = e.clientY - draggable.offsetTop;
            window.addEventListener('mousemove', moveElement, false);
        }

        function mouseUp() {
            window.removeEventListener('mousemove', moveElement, false);
        }

        function moveElement(e) {
            mouseX = e.clientX - posX;
            mouseY = e.clientY - posY;
            draggable.style.left = mouseX + 'px';
            draggable.style.top = mouseY + 'px';
        }
    }


})();

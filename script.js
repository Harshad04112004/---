   // Shop Owner Details (Easily Editable)
        const SHOP_OWNER_NAME = "ઓમકારભાઈ";
        const SHOP_MOBILE = "9876543210"; // Shop's Mobile Number (10 digits)

        // Function to show/hide the custom input field
        function toggleCustomInput(selectElement) {
            const customInput = selectElement.parentNode.querySelector('.custom-item-name');
            if (selectElement.value === 'કસ્ટમ') {
                customInput.style.display = 'block';
                customInput.setAttribute('required', 'required');
                customInput.classList.add('item-name'); // Class for main script to read
            } else {
                customInput.style.display = 'none';
                customInput.removeAttribute('required');
                customInput.value = '';
                customInput.classList.remove('item-name'); // Remove class if not used
            }
        }

        // Function to add a new item row
        function addItem() {
            const container = document.getElementById('itemsContainer');
            const newItemRow = document.createElement('div');
            newItemRow.className = 'item-entry item-row';
            newItemRow.innerHTML = `
                <div class="col-name">
                    <select class="item-selector" onchange="toggleCustomInput(this)">
                        <option value="શર્ટ" selected>શર્ટ (Shirt)</option>
                        <option value="પેન્ટ">પેન્ટ (Pant)</option>
                        <option value="લેંથ-શર્ટ">લેંથ-શર્ટ (Length-Shirt)</option>
                        <option value="કુરતા">કુરતા (Kurta)</option>
                        <option value="કસ્ટમ">અન્ય (Custom Item)</option>
                    </select>
                    <input type="text" class="custom-item-name" placeholder="કસ્ટમ આઇટમનું નામ" style="display:none; margin-top: 5px;">
                </div>
                <input type="number" class="col-qty item-qty" value="1" min="1" required>
                <input type="number" class="col-price item-price" placeholder="રૂ. માં કિંમત" min="0" required>
                <button type="button" class="remove-item" onclick="removeItem(this)">X</button>
            `;
            container.appendChild(newItemRow);
        }

        // Function to remove an item row
        function removeItem(buttonElement) {
            const itemRow = buttonElement.closest('.item-row');
            if (document.querySelectorAll('.item-row').length > 1) {
                itemRow.remove();
            } else {
                alert("ઓછામાં ઓછી એક આઇટમ જરૂરી છે.");
            }
        }

        // Main function to generate the bill
        document.getElementById('billForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const mobile = document.getElementById('mobile').value;
            const items = [];
            let totalAmount = 0;

            const itemRows = document.querySelectorAll('.item-row');
            let allFieldsValid = true;

            itemRows.forEach(row => {
                const selector = row.querySelector('.item-selector');
                const customInput = row.querySelector('.custom-item-name');
                const qty = parseInt(row.querySelector('.item-qty').value);
                const price = parseFloat(row.querySelector('.item-price').value);

                // Determine the item name: selected option value OR custom input value
                let itemName = '';
                if (selector.value === 'કસ્ટમ') {
                    itemName = customInput.value.trim();
                } else {
                    itemName = selector.options[selector.selectedIndex].text.split('(')[0].trim(); // Use the Gujarati name
                }
                
                const subTotal = qty * price;

                if (itemName && qty > 0 && price >= 0 && !isNaN(price)) {
                    items.push({ itemName, qty, price, subTotal });
                    totalAmount += subTotal;
                } else {
                    allFieldsValid = false;
                }
            });

            if (!allFieldsValid) {
                alert("બધી આઇટમની વિગતો (નામ, જથ્થો, કિંમત) યોગ્ય રીતે ભરો.");
                return;
            }

            if (items.length === 0) {
                alert("બિલ બનાવવા માટે કૃપા કરીને ઓછામાં ઓછી એક આઇટમ ઉમેરો.");
                return;
            }

            // Get current Date and Time
            const now = new Date();
            const todayDate = now.toLocaleDateString('gu-IN');
            const currentTime = now.toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' });

            // --- 1. Generate Bill HTML (in Gujarati) ---
            let billTableHTML = `
                <div class="shop-info">
                    <p>માલિકનું નામ: <strong>${SHOP_OWNER_NAME}</strong></p>
                    <p>દુકાનનો મોબાઇલ: <strong>${SHOP_MOBILE}</strong></p>
                </div>
                <div class="bill-header">
                    <h2>ઓમકાર મેન્સ ટેલર શોપ</h2>
                    <p>બિલ તારીખ: <strong>${todayDate}</strong></p>
                    <p>બિલ સમય: <strong>${currentTime}</strong></p>
                    <p>ગ્રાહકનું નામ: <strong>${name}</strong></p>
                    <p>ગ્રાહકનો મોબાઇલ: <strong>${mobile}</strong></p>
                    <hr>
                </div>
                <table class="bill-table">
                    <thead>
                        <tr>
                            <th>ક્રમ</th>
                            <th>આઇટમનું નામ</th>
                            <th>જથ્થો</th>
                            <th>કિંમત (₹)</th>
                            <th>કુલ (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            items.forEach((item, index) => {
                billTableHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.itemName}</td>
                        <td>${item.qty}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${item.subTotal.toFixed(2)}</td>
                    </tr>
                `;
            });

            billTableHTML += `
                <tr class="total-row">
                    <td colspan="4">કુલ રકમ (Total Amount):</td>
                    <td>${totalAmount.toFixed(2)}</td>
                </tr>
                    </tbody>
                </table>
                <p style="text-align: center; margin-top: 20px; font-weight: bold;">આભાર! ફરી પધારજો. (Thank You! Visit Again.)</p>
            `;

            // Display the bill
            document.getElementById('billOutput').innerHTML = billTableHTML;

            // --- 2. Generate WhatsApp Message (in Gujarati) ---
            let whatsappMessage = `
*✂️ ઓમકાર મેન્સ ટેલર શોપ - બિલ*
*માલિક:* ${SHOP_OWNER_NAME}
*સંપર્ક:* ${SHOP_MOBILE}

*બિલ તારીખ:* ${todayDate}
*બિલ સમય:* ${currentTime}
*ગ્રાહકનું નામ:* ${name}
*ગ્રાહકનો મોબાઇલ:* ${mobile}
---
*આઇટમ વિગતો:*
`;

            items.forEach((item, index) => {
                whatsappMessage += `${index + 1}. ${item.itemName} - ${item.qty} x ₹${item.price.toFixed(2)} = ₹${item.subTotal.toFixed(2)}\n`;
            });

            whatsappMessage += `
---
*કુલ રકમ:* ₹${totalAmount.toFixed(2)}

*આભાર! ફરી પધારજો.*
`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(whatsappMessage.trim());

            // Create the standard WhatsApp share link (using customer's number for direct sharing)
            const whatsappLink = `https://wa.me/91${mobile}?text=${encodedMessage}`;

            // Add WhatsApp Share Button
            const whatsappBtnHTML = `<a href="${whatsappLink}" target="_blank" class="whatsapp-btn">📲 WhatsApp પર બિલ મોકલો (${mobile})</a>`;
            document.getElementById('billOutput').innerHTML += whatsappBtnHTML;
        });

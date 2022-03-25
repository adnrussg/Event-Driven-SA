// SET UP 'CONNECTION' TO THE DATABASE
const db = new Localbase('db');

// OBJECT THAT CONTAINS ALL THE VARIABLES
const $ = {
    button: {
        cart: document.getElementById('cart'),
        addData: document.getElementById('addData'),
        saveData: document.getElementById('saveData'),
        removeAll: document.getElementById('removeAll'),
    },
    div: {
        items: document.getElementById('items'),
    },
    table: {
        cartTbody: document.getElementById('cartItems'),
    },
    input: {
        cartTotal: document.getElementById('cartTotal'),
        addImage: document.getElementById('addImage'),
        addName: document.getElementById('addName'),
        addPrice: document.getElementById('addPrice'),
    },
}

// FUNCTION THAT INTERACTS WITH THE DATABASE 
const model = {
    items: {
        get: (id = -1, _callback) => {
            if (parseInt(id) > 0)
                db.collection('items').doc({ id }).get().then(items => _callback(items))
            else
                db.collection('items').get().then(items => _callback(items))
        },
        post: (item) => {
            if (Array.isArray(item))
                item.forEach(i => db.collection('items').add(i))
            else
                db.collection('items').add(item);
        },
        put: (item) => {
            if (Array.isArray(item))
                item.forEach(i => db.collection('items').doc({ id: i.id }).update(i))
            else
                db.collection('items').doc({ id: item.id }).update(item);
        },
        delete: (id = '') => {
            if (id == '')
                db.collection('items').delete()
            else
                db.collection('items').doc({ id }).delete();
        }
    },
    cart: {
        get: (id = -1, _callback) => {
            if (parseInt(id) > 0)
                db.collection('cart').doc({ id }).get().then(items => _callback(items))
            else
                db.collection('cart').get().then(items => _callback(items))
        },
        post: (item) => {
            if (Array.isArray(item))
                item.forEach(i => db.collection('cart').add(i))
            else
                db.collection('cart').add(item);
        },
        put: (item) => {
            db.collection('cart').doc({ id: item.id }).update(item)
        },
        delete: (id = '') => {
            if (id == '')
                db.collection('cart').delete()
            else
                db.collection('cart').doc({ id }).delete();
        }
    },
}

// FUNCTION THAT HANDLES ALL LOGIC 
const controller = ({ div, button, input, table }) => {

    const item_template = `
    <div class="card" style="width: 18rem;">
        <img src="1.jpg" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Wine Name</h5>
            <p class="card-text">P0.00</p>
            <a href="#" class="btn btn-primary">Add to Cart</a>
        </div>
    </div>`;

    const cart_template = `
    <tr>
    <th scope="row">1</th>
    <td scope="row">Lorem Ipsum</td>
    <td scope="row">₱0.00</td>
    <td scope="row">₱0.00</td>
    <td scope="row" class="w-25">
        <div class="input-group">
            <button class="btn btn-outline-primary" type="button">-</button>
            <input type="text" class="form-control" placeholder="" aria-label="Quantity">
            <button class="btn btn-outline-primary" type="button">+</button>
        </div>
    </td>
    <td scope="row">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Remove</button>
    </td>
    </tr>`;

    let id = 0;
    let idAdd = () => { return ++id; };

    let cart = {};

    model.items.get(-1, (items) => {
        if (items.length <= 0) {
            items = [
                { price: 6900, name: "Banfi Brunello di Montalcino DOCG 2010", image: "images\\BanfiBrunellodiMontalcino_0d149a8b-2617-4dda-8640-14f1db701231_360xP6900.webp", id: "1" },
                { price: 5200, name: "Castello di Querceto Il Sole di Alessandro", image: "images\\CastellodiQuercetoIlSolediAlessandro_360xP5200.webp", id: "2" },
                { price: 8900, name: "Château Beauregard Pomerol 1998", image: "images\\ChateauBeauregard1998_360xP8900.webp", id: "3" },
                { price: 67400, name: "Château Latour Pauillac 1989", image: "images\\chateaulatour1989_360xP67400.webp", id: "4" },
                { price: 6200, name: "Château Leret-Monpezat Malbec 'Icône WOW' 2009", image: "images\\ChateauLeretMontpezat_360xP6200.webp", id: "5" },
                { price: 16900, name: "E. Pira & Figli Chiara Boscis Barolo 1964", image: "images\\ChiaraBoscis_360xP16900.webp", id: "6" },
                { price: 4500, name: "Decelle-Villa Gevrey Chambertin", image: "images\\DecelleVillaGevreyChambertin_360xP4500.webp", id: "7" },
                { price: 4500, name: "Decelle-Villa Meursault Blanc", image: "images\\DecelleVillaMeursault_360xP4500.webp", id: "8" },
                { price: 3885, name: "Joseph Phelps Freestone Vineyards Pinot Noir", image: "images\\JosephPhelpsFreestoneVineyardsPinotNoir_360xP3885.webp", id: "9" },
                { price: 39000, name: "Opus One Napa Valley 2013", image: "images\\opusone2013_360xP39000.webp", id: "10" },
                { price: 3800, name: "Stag's Leap Artemis Cabernet Sauvignon", image: "images\\Stag_sLeapArtemis_360xP3800.webp", id: "11" },
                { price: 3900, name: "Yarra Yering Dry Red No. 1 2017", image: "images\\YarraYeringDryRedNo.12016_360xP3900.webp", id: "12" },
            ]
            items.forEach((i,j) => {
                model.items.post(i)
            })
        };
        div.items.innerHTML = '';
        id = items.length;
        items.forEach((i, j) => renderItem(i, j));
    });

    model.cart.get(-1, (items) => {
        if (items.length <= 0) return;
        items.forEach(i => cart[i.id] = i);
    });

    const renderItem = (item, index) => {
        const temp = document.createElement('span');
        temp.innerHTML = item_template;
        const card = temp.childNodes[1];

        const template = {
            image: card.childNodes[1],
            name: card.childNodes[3].childNodes[1],
            price: card.childNodes[3].childNodes[3],
            button: card.childNodes[3].childNodes[5],
        };

        template.image.src = item.image;
        template.name.innerText = `${item.name}`;
        template.price.innerText = `₱${item.price}`;
        template.button.addEventListener('click', event => {
            if (cart[item.id]) {
                cart[item.id].quantity++;
                model.cart.put(cart[item.id]);
            } else {
                cart[item.id] = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                };
                model.cart.post(cart[item.id]);
            }
        });

        div.items.append(card);
    };

    const renderCart = (item, index) => {

        const tr = document.createElement('tr');

        const ct = {
            num: document.createElement('th'),
            name: document.createElement('td'),
            price: document.createElement('td'),
            subtotal: document.createElement('td'),
            quantity: document.createElement('td'),
            remove: document.createElement('td'),
        };

        Object.values(ct).forEach(i => i.setAttribute('scope', 'row'));

        ct.num.innerText = `${index + 1}`;
        ct.name.innerText = `${item.name}`;
        ct.price.innerText = `₱${item.price}`;
        ct.subtotal.innerText = `₱${(item.quantity * item.price).toFixed(2)}`;

        const qt = {
            div: document.createElement('div'),
            add: document.createElement('button'),
            input: document.createElement('input'),
            subtract: document.createElement('button'),
        };

        qt.div.classList.add("input-group");
        qt.div.append(qt.subtract);
        qt.div.append(qt.input);
        qt.div.append(qt.add);

        qt.add.classList.add("btn");
        qt.add.classList.add("btn-primary");
        qt.add.innerText = "+";
        qt.subtract.classList.add("btn");

        if (item.quantity > 1)
            qt.subtract.classList.add("btn-primary");
        else
            qt.subtract.classList.add("btn-secondary");

        if (item.quantity <= 0) qt.subtract.disabled = true;

        qt.subtract.innerText = "-";
        qt.input.classList.add('form-control');
        qt.input.setAttribute('type', 'text');
        qt.input.value = item.quantity;

        ct.quantity.classList.add("w-25")
        ct.quantity.append(qt.div);

        const rm = document.createElement('button');
        rm.innerText = "Remove";
        rm.classList.add("btn");
        rm.classList.add("btn-danger");

        ct.remove.append(rm);

        Object.values(ct).forEach(i => tr.append(i));

        table.cartTbody.append(tr);

        qt.add.addEventListener('click', event => {
            qt.input.value = parseInt(qt.input.value) + 1;

            input.cartTotal.value = parseFloat(input.cartTotal.value) - (qt.input.value - 1) * item.price;

            ct.subtotal.innerText = `₱${(qt.input.value * item.price).toFixed(2)}`;

            input.cartTotal.value = (parseFloat(input.cartTotal.value) + qt.input.value * item.price).toFixed(2);

            item.quantity = qt.input.value;

            if (qt.input.value > 1) {
                qt.subtract.classList.remove("btn-secondary");
                qt.subtract.classList.add("btn-primary");
            } else {
                qt.subtract.classList.add("btn-secondary");
                qt.subtract.classList.remove("btn-primary");
            }

            model.cart.put(item);
        });

        qt.subtract.addEventListener('click', event => {
            if (qt.input.value <= 1) {
                qt.subtract.disabled = true;
                return;
            }

            qt.input.value = parseInt(qt.input.value) - 1;

            input.cartTotal.value = parseFloat(input.cartTotal.value) - qt.input.value * item.price;

            ct.subtotal.innerText = `₱${(qt.input.value * item.price).toFixed(2)}`;

            input.cartTotal.value = (parseFloat(input.cartTotal.value) + (qt.input.value - 1) * item.price).toFixed(2);

            item.quantity = qt.input.value;

            if (qt.input.value > 1) {
                qt.subtract.classList.remove("btn-secondary");
                qt.subtract.classList.add("btn-primary");
            } else {
                qt.subtract.classList.add("btn-secondary");
                qt.subtract.classList.remove("btn-primary");
            }

            model.cart.put(item);
        });

        rm.addEventListener('click', event => {
            input.cartTotal.value = (parseFloat(input.cartTotal.value) - (qt.input.value) * item.price).toFixed(2);
            table.cartTbody.removeChild(tr);
            model.cart.delete(item.id);
        });
    };

    button.saveData.addEventListener('click', event => {
        if (input.addImage.value && input.addName.value && input.addPrice.value) {
            const object = {
                id: idAdd(),
                name: input.addName.value,
                price: input.addPrice.value,
                image: input.addImage.value,
            };

            model.items.post(object);
            renderItem(object);
        };
    });

    button.cart.addEventListener('click', event => {
        model.cart.get(-1, (items) => {
            if (items.length <= 0) return;
            table.cartTbody.innerHTML = '';
            id = items.length;

            let sum = 0;

            items.forEach((i, j) => {
                renderCart(i, j)
                sum += (i.price * i.quantity);
            });

            input.cartTotal.value = sum.toFixed(2);
        });
    });

    button.removeAll.addEventListener('click', event => {
        table.cartTbody.innerHTML = "";
        input.cartTotal.value = "";
        model.cart.delete();
    });
}

controller($);
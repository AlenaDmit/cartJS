document.addEventListener('DOMContentLoaded', function () {
	let context = {};

	const maxPrice = 50,
		  attr_id = 'data-id',
		  DEFAULT_WIDTH = '110px';
//--------------------------------
    var adapter = new Adapter();

    adapter.rollback =  (dragObject) => {
        dragObject.avatar.rollback();
    };
    DragManager.onDragCancel = (dragObject) => {
        adapter.cancel(dragObject);
    };
    DragManager.onDragEnd = (dragObject) => {
        adapter.end(dragObject);
    };
    DragManager.onDragStart = (dragObject, dropElem) => {
        adapter.start(dragObject);
    };

    function Adapter () {
        let self = this;

        this.cancel = (dragObject) => {

            let dragElem = dragObject.elem;
            dragElem.removeAttribute("style");
            dragElem.style.width = DEFAULT_WIDTH;
            self.rollback(dragObject);
        };
        this.start = (dragObject) => {
            let elem = dragObject.elem;
            let computedWidth = document.getElementsByClassName("product")[0].offsetWidth;

            elem.style.width = `${computedWidth - 40}px`;
        };
        this.end = (dragObject) => {

            if(cartPool.getSize() == maxPrice) {
                self.rollback(dragObject);
                alert("You could buy more than " + maxPrice + " $")
                return;
            }
            let dragElem = dragObject.elem;
            addToCart(dragElem);
        };
        this.rollback = (dragObject) => {}
    }

    //---------------///

    function addToCart(elem) {
        if(cartPool.getSize() < maxPrice){
            elem.removeAttribute("style");
            elem.style.width = DEFAULT_WIDTH;

            let attrId = elem.getAttribute(ATTR_ID);
            context.cartbox.appendChild(elem);

            exchange(attrId, listPool, cartPool);
            updatePriceList(cartPool.getTotal());
        }
    }






// ______________________________________________


	exchange = (id, source, destination) => {
    	destination.takeFrom(id, source);
	}

	updateTotalPrice = (total) => {
    	context.listGoods.innerHTML = total.toFixed(2);
	}

	startObjects = () => {
		let fragment = document.createDocumentFragment();

		context.wrapContainer = createElement('wrapper');
		context.container = createElement('container', 'container');
		context.cartBlock = createElement('container__cartBlock droppable', 'cartBlock');
		context.goodsBlock = createElement('container__goodsBlock', 'goodsBlock');

		context.totalPrice = createElement('cartBlock__totalPrice', 'totalPrice');

		context.totalPrice.innerHTML = '0';

		context.cartBlock.appendChild(context.totalPrice);

		listGoods.forEach( (item) => {
			let prod = new Product(item),
				product = createElement('product draggable'),
				productName = createElement('product-name');

				product.setAttribute('ATTR_ID', item.id);
				
            	productName.innerHTML = `${item.title} (${prod.getCost()}$)`;

            	product.append(productName);
           		context.goodsBlock.append(product);

            	let deleteBtn = createElement('deleteBtn', 'deleteBtn');
            	deleteBtn.innerHTML = 'Delete';

            	deleteBtn.addEventListener('click', () => {
                	context.cartBlock.removeChild(product);
               		context.goodsBlock.appendChild(product);

                	exchange(item.id, cartPool, listPool);
                	updateTotalPrice(cartPool.getTotal());
            });

            product.append(deleteBtn);
            listPool.add(prod);
        });

        context.container.append(context.goodsBlock);
        context.container.append(context.cartBlock);
        context.wrapContainer.appendChild(context.container);

        fragment.appendChild(context.wrapContainer);

        document.body.appendChild(fragment);

	}

	createElement = (cssClass, id) => {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', cssClass);
		return newElement;
	}

	let listGoods = [	
				{id: 1, title: 'Apple', cost: 5},
				{id: 2, title: 'Orange', cost: 5},
				{id: 3, title: 'Lime', cost: 6},
				{id: 4, title: 'Strawberry', cost: 13},
				{id: 5, title: 'Cherry', cost: 11},
				{id: 6, title: 'Banana', cost: 2},
				{id: 7, title: 'Mango', cost: 9},
				{id: 8, title: 'Kiwi', cost: 8},
				{id: 9, title: 'Cocount', cost: 15},
				{id: 10, title: 'Papaya', cost: 10},
				{id: 11, title: 'Pineapple', cost: 12},
				{id: 12, title: 'Peach', cost: 7}
	]

	function Product (prop) {
		let id = prop.id,
			title = prop.title,
			cost = prop.cost;

		this.getId = () => {return id};

		this.getTitle = () => {return title};

		this.getCost = () => {return cost};
	}

	function ProductPool () {
        let pool = {},
         	self = this,
         	total = 0,
         	size = 0;

        this.add = (elem) => {
            if( elem instanceof Product){
                let element = pool[elem.getId()];
                if(!element){
                    pool[elem.getId()] = elem;
                    total += elem.getCost();
                    size++;
                }
            }
        };

        this.remove = (elem) => {
            if( elem instanceof Product){
                if(size > 0){
                    let element = pool[elem.getId()];
                    if(element){
                        delete pool[elem.id];
                        total -= elem.getCost();
                        size--;
                    }
                }
        	}
        };

        this.searchById = (id) => { pool[id] };

        this.takeFrom = (id, pool) => {
            let elem = pool.searchById(id);
            self.add(elem);
            pool.remove(elem);
        };

        this.getTotal = () => { return total };

        this.getSize = () => { return size };

    }

    let listPool = new ProductPool(),
    	cartPool = new ProductPool();

    startObjects();

});
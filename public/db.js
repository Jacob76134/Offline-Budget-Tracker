let db;

const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("offlineDB", { autoIncrement: true });
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDB();
    }
};

const saveRecord = (record) => {
    const transaction = db.transaction(["offlineDB"], "readwrite");
    const store = transaction.objectStore("offlineDB");
    store.add(record);
};

function checkDB() {
    console.log('Checking database...');
    const transaction = db.transaction(["offlineDB"], "readwrite");
    
    const store = transaction.objectStore("offlineDB");
    const getAll = store.getAll();
    

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
			fetch("/api/transaction/bulk", {
				method: "POST",
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				},
			})
            .then((response) => {
                return response.json();
            })
            .then (() => {
                const transaction = db.transaction(["offlineDB"], "readwrite");
                const Store = transaction.ObjectStore('offlineDB');
                Store.clear();
            })
        }
    }
}

window.addEventListener("online", checkDB);
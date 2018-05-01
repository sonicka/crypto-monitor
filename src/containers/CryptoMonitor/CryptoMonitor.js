import React, {Component} from 'react';
import axios from 'axios'; // processes http requests
import List from '../../components/List/List'
import TopToolbar from '../../components/TopToolbar/TopToolbar'
import BottomFooter from '../../components/BottomFooter/BottomFooter'
import "./CryptoMonitor.css"


class CryptoCurrency {
    constructor(shortcut, name, price, last_update, volume, change, open, high, low, last_market) {
        this.id = shortcut;
        this.shortcut = shortcut;
        this.name = name;
        this.price = price;
        this.last_update = last_update;
        this.volume = volume;
        this.change = change;
        this.open = open;
        this.high = high;
        this.low = low;
        this.last_market = last_market;
        this.expanded = false;
    }
}

class CryptoMonitor extends Component {
    state = {
        all_coins: new Map(),
        cryptocurrencies: new Map(), // list of actual CC objects, all 30
        selected_currencies: [], // list of CC shortcuts selected from dropdown
        shown_currencies: [], // list of CC objects to show
        options: new Map(), // [shortcut:name] ->> options in dropdown
        open: false,
        sorted: false,
        descending: false
    };

    componentDidMount() {
        this.fetchCoinList();
    //   this.interval = setInterval(() => this.fetchCurrenciesData(""), 10000);
    }

    //componentWillUnmount() {
    //    clearInterval(this.interval);
    //}

    /**
     * fetches coin list from CryptoCompare API
     */
    fetchCoinList = () => {
        this.setState({sorted: false});
        axios.all([
            axios.get('https://min-api.cryptocompare.com/data/all/coinlist')
        ])
            .then(axios.spread((coins) => {
                this.processCoinData(coins);
            }))
            .catch(error => console.log(error));
    };

    /**
     * processes fetched coin data, returns map of pairs shortcut:coin name for first 30 cryptocurrencies
     */
    processCoinData = (coins) => {
        const all_coin_data = coins.data.Data;
        let all_coins = new Map(); // shortcut + name
        let all_shortcuts = Object.keys(all_coin_data); // list of shortcuts (30)
        for (let i = 0; i < all_shortcuts.length; i++) {
            if (all_coins.size === 30)
                break;
            if (parseInt(all_coin_data[all_shortcuts[i]].SortOrder, 10) <= 30) {
                let cn = all_coin_data[all_shortcuts[i]].Symbol;
                let cnn = all_coin_data[all_shortcuts[i]].CoinName;
                all_coins.set(cn, cnn);
            }
        }
        this.setState({all_coins: all_coins, options: all_coins});
        this.fetchCurrenciesData(Array.from(all_coins.keys()));
    };

    /**
     * fetches data for the first 30 cryptocurrencies
     */
    fetchCurrenciesData = (coins) => { // coins = list of shortcuts
        if (coins === "") {
            coins = Array.from(this.state.all_coins.keys());
        }
        let cur = coins;
        let curString = "";
        let query = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=';

        for (let i = 0; i < cur.length; i++) {
            if (i === cur.length - 1) {
                curString = curString.concat(cur[i]);
            } else {
                curString = curString.concat(cur[i] + ",");
            }
        }
        query = query.concat(curString).concat('&tsyms=USD');
        axios.all([
            axios.get(query)
        ])
            .then(axios.spread((currs) => {
                this.processCurrencies(currs.data.DISPLAY);
            }))
            .catch(error => console.log(error));
    };

    /**
     * processes obtained data about currencies and transforms them to CryptoCurrency objects
     */
    processCurrencies = (currs) => {
        let shortcuts = Object.keys(currs);
        let cryptocurrencies = new Map();
        let all_coins = this.state.all_coins;

        for (let i = 0; i < Object.keys(currs).length; i++) {
            let cc = currs[shortcuts[i]].USD;
            let newCC = new CryptoCurrency(shortcuts[i], all_coins.get(shortcuts[i]), cc.PRICE, cc.LASTUPDATE, cc.TOTALVOLUME24HTO,
                cc.CHANGE24HOUR, cc.OPEN24HOUR, cc.HIGH24HOUR, cc.LOW24HOUR, cc.LASTMARKET);
            cryptocurrencies.set(shortcuts[i], newCC);
        }
        this.setState({cryptocurrencies: cryptocurrencies}, this.retrieveDataFromLocalStorage);
    };

    /**
     * retrieves data from local storage and reflects them as cryptocurrencies shown on the page
     */
    retrieveDataFromLocalStorage = () => {
        if (localStorage.length === 0 || localStorage.getItem('chosenCurrencies') === "") {
            this.setState({shown_currencies: []});
            return;
        }
        if (localStorage.getItem('chosenCurrencies')) {
            let storedCurrencies = localStorage.getItem('chosenCurrencies').split(",");
            let cryptocurrencies = this.state.cryptocurrencies;
            let updatedOptions = new Map(this.state.options);
            let retrieved = [];
            storedCurrencies.map(item => {
                if (cryptocurrencies.get(item)) {
                    retrieved.push(cryptocurrencies.get(item));
                    updatedOptions.delete(item);
                }
                return 0;
            });
            if (this.state.sorted) {
                if (this.state.descending) {
                    retrieved.sort((a, b) => a.price > b.price ? -1 : 1);
                } else {
                    retrieved.sort((a, b) => a.price < b.price ? -1 : 1);
                }
            }
            this.setState({shown_currencies: retrieved, options: updatedOptions, selected_currencies: storedCurrencies});
        }
    };

    /**
     * handles selecting an option in dropdow menu, updates shown currencies, options in dropdown and localStorage entry
     */
    handleSelect = (event) => {
        let all_currs = this.state.cryptocurrencies; // map
        let shown = [...this.state.shown_currencies];
        let options = new Map(this.state.options);
        let selected = [...this.state.selected_currencies];
        if (all_currs.get(event.target.value) !== undefined) {
            shown.push(all_currs.get(event.target.value));
        }
        // add item to list of selected
        selected.push(event.target.value);
        // remove selected from options
        options.delete(event.target.value);
        // store chosen currencies to local storage
        localStorage.setItem('chosenCurrencies', selected.toString());
        this.setState({selected_currencies: selected, options: options, shown_currencies: shown});
    };

    /**
     * removes shown item after click on X button, returns option back to dropdown
     */
    removeHandler = (item) => {
        let updatedShownList = [...this.state.shown_currencies];
        let updatedSelectedList = [...this.state.selected_currencies];
        let updatedOptionList = this.state.options;
        for (let i = 0; i < updatedShownList.length; i++) {
            if (updatedShownList[i].id === item) {
                updatedOptionList.set(updatedShownList[i].id, updatedShownList[i].name);
                updatedShownList.splice(i, 1).pop();
                let index = updatedSelectedList.indexOf(item);
                if (index > -1) {
                    updatedSelectedList.splice(index, 1);
                }
                break;
            }
        }
        // update local storage entry of chosen currencies
        localStorage.setItem('chosenCurrencies', this.listToString(updatedShownList));
        this.setState({shown_currencies: updatedShownList, selected_currencies: updatedSelectedList, options: updatedOptionList});
    };

    /**
     * converts list to string divided by "," in order to be saved in local storage
     */
    listToString = (list) => {
        let str = "";
        list.map(item => {
            str = str.concat(item["shortcut"].toString() + ",");
            return 0;
        });
        return str.slice(0, -1);
    };

    /**
     * sorts list of shown currencies by current price
     */
    sortByValue = () => {
        let sorted = [...this.state.shown_currencies];
        if (this.state.descending) {
            sorted.sort((a, b) => parseFloat(a.price.substr(2).replace(/[^\d\.\-]/g, "")) < parseFloat(b.price.substr(2)
                .replace(/[^\d\.\-]/g, "")) ? -1 : 1);
        } else {
            sorted.sort((a, b) => parseFloat(a.price.substr(2).replace(/[^\d\.\-]/g, "")) > parseFloat(b.price.substr(2)
                .replace(/[^\d\.\-]/g, "")) ? -1 : 1);
        }
        this.setState(prevState => ({shown_currencies: sorted, sorted: true, descending: !prevState.descending}));
    };

    render() {
        return (
            <div className="crypto-monitor">
                <TopToolbar
                    allCoins={this.state.options}
                    handleSelect={this.handleSelect}/>
                <List
                    list={this.state.shown_currencies.length === 0 ? [] : this.state.shown_currencies}
                    handleX={this.removeHandler}/>
                <BottomFooter
                    sort={this.sortByValue}
                    refresh={() => this.fetchCurrenciesData("")}/>
            </div>
        );
    }
}

export default CryptoMonitor;
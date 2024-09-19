import { AbstractiveView } from '../../common/view.js';
import onChange from 'on-change';
import { Header } from '../../components/header/header.js';
import { Search } from '../../components/search/search.js';
import { CardList } from '../../components/card-list/card-list.js';
export class MainView extends AbstractiveView {
  state = {
    loading: false,
    searchQuery: undefined,
    offset: 0,
    q: "",
    list: [],

  }

  constructor(appState = {}) {
    super()
    this.appState = appState
    this.appState = onChange(this.appState, this.appStateHook.bind(this))
    this.state = onChange(this.state, this.stateHook.bind(this))
    this.setTitle("Book Search")
  }

  appStateHook(path) {
    if (path === "favorites") {
      console.log(path)
    }
  }
  async stateHook(path) {
    if (path === "searchQuery") {
      this.state.loading = true
      const data = await this.loadList(this.state.searchQuery, this.state.offset)
      this.state.loading = false
      console.log(data)
      this.state.list = data

    }
    if (path === "list" || path === "loading") {
      this.render()
    }
  }

  async loadList(q, offset) { //Глобальный метод fetch() запускает процесс извлечения ресурса из сети
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${q}&offset=${offset}`)
      return res.json()

    } catch (error) {
      console.log(error, 'PIZDA')
    }

  }

  render() {
    if (this?.appState?.favorites) {
      const main = document.createElement('div');
      main.append(new Search(this.state).render())
      main.append(new CardList(this.appState, this.state).render())

      this.app.innerHTML = "";
      this.app.append(main);
      this.renderHeader()
      this.appState.favorites.push('i')
    } else {
      console.error('favorites is non defined')
    }

  }
  renderHeader() {
    const header = new Header(this.appState).render()
    this.app.prepend(header)

  }

}
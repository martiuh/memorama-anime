import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import gon from '../images/gon.jpg'
import naruto from '../images/naruto.jpg'
import killua from '../images/killua.jpg'
import guts from '../images/guts.jpg'
import saitama from '../images/saitama.jpg'

import './index.css'

const mockArr = [gon, naruto, killua, guts, saitama]

// Tomada de esta respuesta en stackoverflow https://stackoverflow.com/a/12646864/4879756
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
  return array
}

const uniqueID = () => `${Math.random().toString(32).substr(3)}`

class App extends React.Component {
  state = {
    gamemode: 'regular',
    gamemodes: ['regular', 'tries'],
    game: {
      mode: 'regular'
    },
    cards: shuffleArray([...mockArr, ...mockArr]).map(G => ({ name: G, src: G, id: uniqueID(), found: false })),
    from: { id: null, name: null },
    to: null
  }

  select = ({ id, name }) => {
    const { from, cards } = this.state
    if (!from.id) { // Inicia la primera selección
      return this.setState({ from: { id, name } })
    }
    else {
      if (from.name === name) {
        const ganaste = cards.filter(({ found }) => !found).length === 2 // Encontró el par faltante y automáticamente ganó
        if (ganaste) {
          alert('GANASTE PERRO!!!!')
        }
        this.setState(prev => ({
          cards: cards.map(C => {
            if (C.name === name) {
              C.found = true
            }
            return C
          })
        }))
      }
      // Corro la animación para que se vea que se hizo el par y se bloqueé
      return this.setState({ to: id }, () => setTimeout(() => {
        this.setState({from: { id: null, name: null }, to: null })
      }, 100))
    }
  }

  isSelected = ({ id, name, found }) => {
    const { from, to, pairs } = this.state
    const style = {}
    if (id === from.id || to === id) {
      style.filter = 'blur(2px)'
    }
    if (found) {
      style.filter = 'invert(100%)'
    }
    return style
  }

  render () {
    const { cards, from, to } = this.state
    console.log(cards)
    return (
      <main>
        <h1>Memorama</h1>
        <div className='memorama'>
          {cards.map(({ name, id, found, src }) => (
            <button
              disabled={id === from.id || to === id || found}
              onClick={() => this.select({ id, name })}
              className='card'
              key={id}>
              <img
              style={this.isSelected({ id, name, found })}
                src={name}
              />
            </button>
          ))}
        </div>
      </main>
    )
  }
}

const IndexPage = () => (
  <Layout>
    <App />
  </Layout>
)

export default IndexPage

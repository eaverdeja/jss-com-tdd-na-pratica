import {expect} from 'chai'

import fizzBuzz from '../../src/fizzbuzz'

describe('FizzBuzz', () => {
  it('Deve retornar FizzBuzz quando o número for divisível por 3 e 5', () => {
    expect(fizzBuzz(15)).to.equal('FizzBuzz')
    expect(fizzBuzz(30)).to.equal('FizzBuzz')
  })

  it('Deve retornar Fizz quando o número for divisível por 3', () => {
    expect(fizzBuzz(9)).to.equal('Fizz')
    expect(fizzBuzz(27)).to.equal('Fizz')
  })

  it('Deve retornar Buzz quando o número for divisível por 5', () => {
    expect(fizzBuzz(20)).to.equal('Buzz')
    expect(fizzBuzz(35)).to.equal('Buzz')
  })

  it('Deve retornar o próprio número caso ele não seja divisível por 3 e 5', () => {
    expect(fizzBuzz(4)).to.equal(4)
    expect(fizzBuzz(71)).to.equal(71)
    expect(fizzBuzz(0)).to.equal(0)
  })
})

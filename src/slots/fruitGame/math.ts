// reel 1 = [1, 1, 2 ,3]
// reel 2 = [1, 1, 2, 2, 3]
// reel 3 = [1, 1, 2, 3]

// numbers inside reels arrays are called symbols

export class FruitGameMath {
  constructor(balance: number) {
    this.balance = balance
  }
  reel1 = [1, 1, 2, 3]
  reel2 = [1, 1, 2, 2, 3]
  reel3 = [1, 1, 2, 3]

  payoutMultiplierTable: { [key: string]: number } = {
    '11': 1,
    '22': 2,
    '33': 4,
    '111': 2,
    '222': 8,
    '333': 15
  }

  private resultSymbols: number[] = []

  betAmount: number = 0
  balance: number = 0

  error = ''

  status: 'idle' | 'spinning' | 'finished' | 'waiting' = 'idle'

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  generateRandomSymbolsForReels(): void {
    if (!this.isBalanceEnough()) {
      this.error = 'Insufficient balance'
      return
    }

    if (!this.isBetAmountValid()) {
      this.error = 'Invalid bet amount'
      return
    }

    this.error = ''

    this.updateBalance(-this.betAmount)
    this.setStatus('spinning')

    setTimeout(() => {
      this.setStatus('finished')

      const reel1Result = this.getRandomSymbolForReel(this.reel1)
      const reel2Result = this.getRandomSymbolForReel(this.reel2)
      const reel3Result = this.getRandomSymbolForReel(this.reel3)

      this.resultSymbols = [reel1Result, reel2Result, reel3Result]

      this.updateBalance(this.getPayoutAmount())
      setTimeout(() => {
        console.log('TÄÄl')
        this.setStatus('waiting')
      }, 1000)
    }, 1000)
  }

  private getRandomSymbolForReel(reel: number[]): number {
    const index = this.randomInt(0, reel.length - 1)
    return reel[index]
  }

  private handleGetPayoutMultiplier(resultSymbols: number[]): number {
    const key = resultSymbols.join('')
    return this.getPayoutMultiplier(key)
  }

  private allSymbolsAreEqual(resultSymbols: number[]): boolean {
    return resultSymbols.every((symbol, _index, arr) => symbol === arr[0])
  }

  private filterLastSymbol(resultSymbols: number[]): number[] {
    return resultSymbols.slice(0, resultSymbols.length - 1)
  }

  private getPayoutMultiplier(key: string): number {
    return this.payoutMultiplierTable?.[key] || 0
  }

  private isBalanceEnough(): boolean {
    return this.balance >= this.betAmount
  }

  private isBetAmountValid(): boolean {
    return this.betAmount > 0
  }

  private updateBalance(amount: number): void {
    this.balance += amount
  }

  private setStatus(status: 'idle' | 'spinning' | 'finished' | 'waiting'): void {
    this.status = status
  }

  setBetAmount(amount: number): void {
    this.betAmount = amount
  }

  getStatus(): 'idle' | 'spinning' | 'finished' | 'waiting' {
    return this.status
  }

  getBalance(): number {
    return this.balance
  }

  getPayoutAmount(): number {
    return this.betAmount * this.getWinningMultiplier()
  }

  getResultSymbols(): number[] {
    return this.resultSymbols
  }

  getWinningMultiplier(): number {
    if (this.allSymbolsAreEqual(this.resultSymbols)) {
      return this.handleGetPayoutMultiplier(this.resultSymbols)
    }

    if (this.allSymbolsAreEqual(this.filterLastSymbol(this.resultSymbols))) {
      return this.handleGetPayoutMultiplier(this.filterLastSymbol(this.resultSymbols))
    }

    return 0
  }
}

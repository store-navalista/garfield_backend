import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { code } from './CurrencyResolver'

@Injectable()
export class CurrencyService {
   constructor() {}

   @CatchError('Failed to get currency by pair')
   async getCurrency(pair: [code, code]): Promise<any> {
      const [baseCurrency, quoteCurrency] = pair

      if (pair.join('') === 'USDUSD') {
         return { crossRate: 1 }
      }

      const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11')
      const rates = response.data

      if (pair.join('') === 'USDEUR') {
         const baseRate = rates.find((rate: any) => rate.ccy === baseCurrency)
         const quoteRate = rates.find((rate: any) => rate.ccy === quoteCurrency)
         const crossRate = (Number(baseRate.buy) / Number(quoteRate.buy)).toFixed(3)

         return {
            baseCurrency,
            quoteCurrency,
            crossRate
         }
      }

      if (pair.join('') === 'USDUAH') {
         const buy = rates.find((rate: any) => rate.ccy === 'USD').buy
         const sale = rates.find((rate: any) => rate.ccy === 'USD').sale

         return { crossRate: (Number(buy) + Number(sale)) / 2 }
      }

      throw new Error(`Курсы для валютной пары ${baseCurrency}/${quoteCurrency} не найдены`)
   }
}

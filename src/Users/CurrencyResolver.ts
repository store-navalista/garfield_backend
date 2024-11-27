import { Args, Query, Resolver } from '@nestjs/graphql'
import { CurrencyRate } from 'src/graphql/models/CurrencyRate'
import { CurrencyService } from './CurrencyService'

export type code = 'USD' | 'EUR' | 'UAH'

@Resolver(() => CurrencyRate)
export class CurrencyResolver {
   constructor(private currencyResolver: CurrencyService) {}

   @Query(() => CurrencyRate, { nullable: true })
   getCurrency(@Args('pair', { type: () => [String] }) pair: [code, code]) {
      return this.currencyResolver.getCurrency(pair)
   }
}

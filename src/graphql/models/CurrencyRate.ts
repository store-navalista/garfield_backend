import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class CurrencyRate {
   @Field(() => String, { nullable: true })
   baseCurrency: string

   @Field(() => String, { nullable: true })
   quoteCurrency: string

   @Field(() => String, { nullable: true })
   crossRate: string

   @Field(() => String, { nullable: true })
   buy: string

   @Field(() => String, { nullable: true })
   sell: string
}

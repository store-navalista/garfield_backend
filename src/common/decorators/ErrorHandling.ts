export function CatchError(errorMessage?: string) {
   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
         try {
            return await originalMethod.apply(this, args)
         } catch (error) {
            const message = !errorMessage ? '' : errorMessage === 'empty' ? 'Catch error: ' : `${errorMessage}: `

            throw new Error(`${message}${error.message}`)
         }
      }

      return descriptor
   }
}

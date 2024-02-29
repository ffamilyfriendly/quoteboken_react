import { getQuoteAmount } from "@/lib/quoteActions"

export async function HeroSubtitle() {
    const amount = await getQuoteAmount()
  
    if(!amount.ok) return <p>something wrong</p>
  
    return <p>There are <b>{amount.data}</b> incriminating quotes</p>
  }
interface QuoteBoxProps {
  quote: string
  inspiration: string
}

export default function QuoteBox({ quote, inspiration }: QuoteBoxProps) {
  return (
    <div className="mb-6">
      <p className="text-center italic text-teal-700 mb-4">"{quote}"</p>
      <p className="text-sm text-gray-600 text-center">{inspiration}</p>
    </div>
  )
}

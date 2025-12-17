const WhatsAppFloat = () => {
  const handleClick = () => {
    window.open('https://wa.me/919958983578', '_blank', 'noopener')
  }

  return (
    <a
      className="wa"
      href="https://wa.me/919958983578"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={(e) => {
        e.preventDefault()
        handleClick()
      }}
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  )
}

export default WhatsAppFloat


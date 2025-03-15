const FAQS = [
  {
    question: "What is Contrashutter?",
    answer:
      "Contrashutter is a professional service provider offering photography, makeup, decoration, graphic design, and brand identity marketing services.",
  },
  {
    question: "Where is Contrashutter based?",
    answer:
      "Contrashutter is based in Pune, India, but provides services across various locations.",
  },
  {
    question: "What services does Contrashutter offer?",
    answer:
      "We offer photography, videography, makeup, grooming, event decoration, and graphic design services.",
  },
  {
    question: "Do you provide services outside Pune?",
    answer:
      "Yes, we offer services in other locations, but additional travel charges may apply.",
  },
  {
    question: "How can I contact Contrashutter for inquiries?",
    answer:
      "You can contact us via email, phone, or visit our official website.",
  },
  {
    question: "Is Contrashutter a photography-only company?",
    answer:
      "No, we provide multiple services beyond photography, including makeup, decoration, and branding.",
  },
  {
    question:
      "What makes Contrashutter different from other photography service providers?",
    answer:
      "We offer a complete package of services under one roof, ensuring high-quality and professional service delivery.",
  },
  {
    question: "Does Contrashutter provide customized packages?",
    answer: "Yes, we offer tailored packages based on client requirements.",
  },
  {
    question: "Can I visit your office for consultation?",
    answer:
      "Yes, you can schedule a visit to discuss your requirements with our team.",
  },
  {
    question: "Does Contrashutter work with businesses for corporate shoots?",
    answer:
      "Yes, we provide photography and branding services for corporate events and businesses.",
  },
  {
    question: "How can I book a service with Contrashutter?",
    answer:
      "You can book a service through our website or mobile app by selecting your preferred package and filling out the booking form.",
  },
  {
    question: "Can I book multiple services together?",
    answer: "Yes, we provide combo packages for multiple services.",
  },
  {
    question: "How far in advance should I book my event?",
    answer:
      "We recommend booking at least 1 month in advance to secure your preferred date.",
  },
  {
    question: "Do you provide last-minute bookings?",
    answer:
      "Yes, but availability depends on our schedule and team availability.",
  },
  {
    question: "Can I change my booking date after confirming?",
    answer:
      "Yes, date changes are allowed but are subject to availability and rescheduling charges.",
  },
  {
    question: "How long does a typical shoot take?",
    answer:
      "It depends on the event; standard sessions last between 2-8 hours.",
  },
  {
    question: "Do you offer pre-wedding and post-wedding shoots?",
    answer:
      "Yes, we provide customized pre-wedding and post-wedding photography packages.",
  },
  {
    question: "What if my event location changes after booking?",
    answer:
      "We can accommodate location changes, but additional charges may apply.",
  },
  {
    question: "How do I know if a photographer is available for my event date?",
    answer: "You can check availability by contacting us directly.",
  },
  {
    question: "Do you offer customized photography packages?",
    answer:
      "Yes, we offer tailor-made photography packages based on client requirements.",
  },
  {
    question: "What types of events does Contrashutter cover?",
    answer:
      "We cover weddings, birthdays, corporate events, fashion shoots, pre-wedding shoots, and more.",
  },
  {
    question: "How can I cancel my booking?",
    answer:
      "You can cancel your booking by logging into your account and requesting a cancellation. Please refer to our cancellation policy for applicable charges.",
  },
  {
    question: "What is the refund policy for cancellations?",
    answer:
      "If you cancel before a specific period, you may receive a partial refund. Check our refund policy for detailed terms.",
  },
  {
    question: "Do you offer installment payment options?",
    answer:
      "Yes, we offer flexible payment plans including full payment and installment options.",
  },
  {
    question: "What is included in the wedding photography package?",
    answer:
      "Our wedding package includes candid photography, traditional photography, videography, albums, and digital delivery of images.",
  },
  {
    question: "Can I reschedule my booking?",
    answer:
      "Yes, rescheduling is possible based on availability and may incur additional charges.",
  },
  {
    question: "How long does it take to receive final images?",
    answer:
      "Delivery time depends on the type of package selected, typically ranging from 7 to 30 days.",
  },
  {
    question: "Do you provide raw images and videos?",
    answer:
      "Raw files are provided upon request and may be chargeable depending on the package.",
  },
  {
    question: "Is a pre-wedding shoot included in the wedding package?",
    answer:
      "Some of our wedding packages include a complimentary pre-wedding shoot, while others may require an additional charge.",
  },
  {
    question: "Do you provide drone photography?",
    answer:
      "Yes, drone photography is available as an add-on service for certain packages.",
  },
  {
    question: "What locations do you serve?",
    answer:
      "We provide services across multiple cities and are open to traveling based on client needs.",
  },
  {
    question: "Do you provide event decoration services?",
    answer:
      "Yes, we offer professional decoration services for weddings, birthdays, and corporate events.",
  },
  {
    question: "Can I get a customized decoration theme?",
    answer:
      "Yes, we specialize in creating customized themes based on your preferences.",
  },
  {
    question: "Do you offer makeup services?",
    answer:
      "Yes, we provide bridal makeup, party makeup, and professional grooming services.",
  },
  {
    question: "Are your makeup artists certified?",
    answer:
      "Yes, all our makeup artists are certified professionals with extensive experience.",
  },
  {
    question: "What is included in the brand identity service?",
    answer:
      "Our brand identity services include logo design, business cards, brochures, banners, and corporate branding solutions.",
  },
  {
    question: "Can I get a digital copy of my photos?",
    answer:
      "Yes, we provide digital copies of all photos through a secure online portal.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept online payments, bank transfers, UPI, and cash payments.",
  },
  {
    question: "How do I become a service partner with Contrashutter?",
    answer:
      "You can apply through our website under the 'Join as a Service Partner' section and follow the registration process.",
  },
  {
    question: "Do you offer franchise opportunities?",
    answer:
      "Yes, we offer franchise opportunities for business expansion. Contact us for details.",
  },
  {
    question: "How do you ensure quality in your services?",
    answer:
      "We have strict quality control measures, professional equipment, and trained staff to ensure top-notch service delivery.",
  },
  {
    question:
      "What happens if the photographer is unavailable on the event day?",
    answer:
      "We have backup photographers to ensure your event coverage is not affected.",
  },
  {
    question: "Do you offer last-minute bookings?",
    answer:
      "Yes, but last-minute bookings are subject to availability and may carry an extra charge.",
  },
  {
    question: "How do I receive my edited photos?",
    answer:
      "Final edited photos are delivered via a secure online gallery and physical albums if included in your package.",
  },
  {
    question: "Can I request additional editing on my photos?",
    answer: "Yes, additional edits can be requested for a nominal fee.",
  },
  {
    question: "Do you offer discounts for bulk bookings?",
    answer:
      "Yes, we offer discounts for multiple event bookings or corporate clients.",
  },
  {
    question: "Is there a contract for photography services?",
    answer:
      "Yes, we provide a contract to ensure transparency and clarity in our service terms.",
  },
  {
    question: "Can I choose a specific photographer?",
    answer:
      "Yes, based on availability, you can request a specific photographer.",
  },
  {
    question: "Do you have a studio for indoor shoots?",
    answer:
      "Yes, we have a well-equipped studio for indoor and portrait photography.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can contact us through our website, email, or customer support helpline.",
  },
  {
    question: "What is the resolution of delivered images?",
    answer:
      "We provide high-resolution images suitable for both digital and print use.",
  },
  {
    question: "Do you offer training programs for photographers?",
    answer: "Yes, we offer training and workshops for aspiring photographers.",
  },
  {
    question: "How secure is my data with Contrashutter?",
    answer:
      "We follow strict data security protocols to protect your personal and event information.",
  },
  {
    question: "Can I get a refund if I’m not satisfied with the photos?",
    answer: "Partial refunds may be granted based on the situation.",
  },
  {
    question: "Do you provide props for photoshoots?",
    answer:
      "Yes, props are provided for themed photoshoots based on availability.",
  },
  {
    question: "Do you cover international events?",
    answer: "Yes, we offer international event coverage upon request.",
  },
  {
    question: "Can I purchase gift cards for your services?",
    answer:
      "Yes, we offer gift cards that can be redeemed for any of our services.",
  },
  {
    question: "How far in advance should I book my wedding photography?",
    answer:
      "We recommend booking at least 2 months in advance for the best availability.",
  },
];

export default FAQS;

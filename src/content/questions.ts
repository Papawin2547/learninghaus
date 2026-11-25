// ข้อความคำถามและคำตอบ: แก้ข้อความในไฟล์นี้ แล้วรัน `pnpm build`
// หมายเหตุ: คำตอบของ Chapter 1 ระบุด้วย c (เริ่มนับจาก 0)
namespace LearningHausQuestions {
  // q = คำถาม, a = ตัวเลือก, c = ลำดับคำตอบที่ถูก (เริ่มที่ 0), why = คำอธิบายหลังจบด่าน
  export type Question = { q: string; a: string[]; c: number; why: string };
  export type PromptSpec = [string, string, string?, string[]?];

  // คำถาม Chapter 1: แก้ข้อความได้โดยไม่ต้องเปลี่ยนระบบคะแนน
  export const chapterOne: Question[] = [
    {
      q: "What is the primary objective (Subject Matter) of Article 1 of the EU AI Act?",
      a: [
        "To define coding standards for AI software.",
        "To lay down rules for placing AI systems on the market, their use, and the protection of fundamental rights.",
        "To appoint CEOs for technology companies in Europe.",
        "To collect taxes from users of generative AI tools."
      ],
      c: 1,
      why: "Article 1 establishes harmonised rules for placing AI systems on the market and putting them into service or use. It also aims to protect health, safety and fundamental rights."
    },
    {
      q: "Who are the primary groups covered under the scope (Article 2) of the Act?",
      a: [
        "Only students using AI for homework.",
        "Providers (developers) and Deployers (those using AI in a professional context).",
        "Only companies with headquarters located in Brussels.",
        "Individuals using AI for personal, non-professional entertainment at home."
      ],
      c: 1,
      why: "The Act covers providers and deployers of AI systems, among other actors in the AI value chain. Its scope also reaches some organisations outside the EU when AI output is used within the EU."
    },
    {
      q: "What is a provider under the EU AI Act?",
      a: [
        "A person who only watches AI videos.",
        "A person or organisation that develops an AI system or has one developed and places it on the market under its own name.",
        "Any person who reads AI-generated text.",
        "Only a government regulator."
      ],
      c: 1,
      why: "A provider develops, or has developed, an AI system or model and places it on the market or puts it into service under its own name or trademark."
    },
    {
      q: "What is a deployer under the EU AI Act?",
      a: [
        "A person or organisation using an AI system under its authority, outside purely personal non-professional use.",
        "Only the original software developer.",
        "A company that sells computer hardware only.",
        "Only a national court."
      ],
      c: 0,
      why: "A deployer uses an AI system under its authority. The definition excludes purely personal, non-professional use."
    },
    {
      q: "What does Article 4 address?",
      a: [
        "Corporate tax rates.",
        "The colour of an AI application.",
        "AI literacy for providers and deployers and people dealing with AI on their behalf.",
        "A fixed minimum price for AI services."
      ],
      c: 2,
      why: "Article 4 asks providers and deployers to take measures to ensure an appropriate level of AI literacy, taking account of their context and the people involved."
    },
    {
      q: "Which aim is named in Article 1?",
      a: [
        "Protecting fundamental rights, health and safety.",
        "Guaranteeing that all AI outputs are correct.",
        "Making every AI system open source.",
        "Replacing all national authorities."
      ],
      c: 0,
      why: "Article 1 explicitly includes the protection of health, safety and fundamental rights among the Act's aims."
    },
    {
      q: "Can a provider outside the EU fall within the Act's scope?",
      a: [
        "No, never.",
        "Yes, in circumstances such as placing an AI system on the EU market or where its output is used in the EU.",
        "Only if it has an office in Brussels.",
        "Only after a user submits a complaint."
      ],
      c: 1,
      why: "The Act has some extra-territorial reach. Certain providers and deployers outside the EU may be covered when their systems or outputs enter the EU context."
    },
    {
      q: "What does 'placing on the market' refer to?",
      a: [
        "Creating a social-media post about AI.",
        "Making an AI system available on the EU market for the first time.",
        "Teaching a class about AI.",
        "Deleting an old model."
      ],
      c: 1,
      why: "In the Act, placing on the market means the first making available of an AI system or general-purpose AI model on the Union market."
    },
    {
      q: "Is purely personal, non-professional AI use by a natural person treated as deployer use?",
      a: [
        "Yes, always.",
        "No; the deployer definition excludes purely personal, non-professional activity.",
        "Only if the person is over 18.",
        "Only if the AI is free."
      ],
      c: 1,
      why: "The definition of deployer excludes use of an AI system in the course of a purely personal non-professional activity."
    },
    {
      q: "Which statement best describes the Act's overall approach?",
      a: [
        "Every AI system has exactly the same obligations.",
        "Rules vary with the use and risk of the AI system.",
        "Only research laboratories must follow it.",
        "The Act bans all AI in Europe."
      ],
      c: 1,
      why: "The EU AI Act uses a risk-based approach, with different obligations for different uses and categories of AI systems."
    }
  ];

  // Each chapter has ten distinct prompts with domain-specific explanations and realistic distractors.
  export const chapterPrompts: Record<number, PromptSpec[]> = {
    2: [
      [
        "Which practice is prohibited when it uses subliminal techniques to materially distort behaviour and cause significant harm?",
        "Manipulative AI that meets the Act's prohibited-practice conditions.",
        "Article 5(1)(a) bans AI systems that deploy subliminal, purposefully manipulative, or deceptive techniques to impair informed decision-making and cause significant harm.",
        [
          "Any recommendation engine that ranks shopping results by popularity.",
          "Standard spell-checking tools that suggest alternative phrasing.",
          "Optional accessibility prompts that read screen content aloud."
        ]
      ],
      [
        "What does the Act say about AI that exploits a person's vulnerabilities in a harmful way?",
        "It can be prohibited when the Act's conditions are met.",
        "Article 5(1)(b) prohibits AI systems that exploit vulnerabilities related to age, disability, or a specific social or economic situation to materially distort behaviour and cause significant harm.",
        [
          "It is allowed whenever the user accepts standard terms of service.",
          "It is regulated only as a minimal-risk voluntary code of conduct.",
          "It applies only to hardware medical devices sold in hospitals."
        ]
      ],
      [
        "May AI be used for indiscriminate scraping of facial images to build facial-recognition databases?",
        "No, that practice is prohibited.",
        "Article 5(1)(e) prohibits untargeted scraping of facial images from the internet or CCTV footage to create or expand facial-recognition databases.",
        [
          "Yes, provided the scraped photos were posted on public social media.",
          "Yes, if the database is stored on servers outside the European Union.",
          "Yes, whenever the provider publishes an annual transparency report."
        ]
      ],
      [
        "What is the general rule on emotion recognition in workplaces and educational institutions?",
        "It is prohibited, subject to limited medical or safety exceptions.",
        "Article 5(1)(f) prohibits inferring emotions of natural persons in workplace and educational settings, except where deployed strictly for medical or safety reasons.",
        [
          "It is permitted whenever employees or students are notified in advance.",
          "It is mandatory for remote-proctoring and attendance systems.",
          "It is unrestricted as long as raw video recordings are deleted weekly."
        ]
      ],
      [
        "Is biometric categorisation used to infer sensitive traits allowed without restriction?",
        "No, specified uses are prohibited.",
        "Article 5(1)(g) prohibits biometric categorisation systems that deduce race, political opinions, trade union membership, religious beliefs, sex life, or sexual orientation, subject to narrow law-enforcement exceptions.",
        [
          "Yes, if the system achieves at least 95% benchmark accuracy.",
          "Yes, for commercial ad-targeting and retail customer profiling.",
          "Yes, whenever biometric templates are hashed after processing."
        ]
      ],
      [
        "What is social scoring under the prohibited-practices rules?",
        "Evaluating people over time using social behaviour or personal traits in a way that leads to specified harmful treatment.",
        "Article 5(1)(c) prohibits social scoring that leads to detrimental or unfavourable treatment in unrelated contexts or treatment that is unjustified or disproportionate.",
        [
          "Calculating a player's experience points inside an educational quiz game.",
          "Ranking job applicants strictly on verified professional qualifications.",
          "Measuring website traffic metrics using aggregated anonymous analytics."
        ]
      ],
      [
        "Can AI predict a person's criminal risk solely from profiling or personality traits?",
        "No, this specified individual criminal-risk prediction is prohibited.",
        "Article 5(1)(d) bans assessing or predicting the risk of a natural person committing a criminal offence based solely on profiling or assessing personality traits and characteristics.",
        [
          "Yes, if used only as a preliminary screening score by local police.",
          "Yes, provided the training dataset uses historical court records.",
          "Yes, when deployed by private security contractors in shopping centres."
        ]
      ],
      [
        "Are all uses of remote biometric identification in public spaces automatically permitted?",
        "No, strict rules and limited exceptions apply.",
        "Article 5(1)(h) generally prohibits real-time remote biometric identification in publicly accessible spaces for law enforcement, allowing only narrowly defined, strictly necessary exceptions subject to authorisation.",
        [
          "Yes, any municipal authority may run continuous live facial recognition.",
          "Yes, retail stores and stadiums can use it freely for crowd analytics.",
          "Yes, as long as a small camera icon is posted at the entrance."
        ]
      ],
      [
        "Why does the Act prohibit certain AI practices?",
        "To prevent unacceptable risks to safety and fundamental rights.",
        "Prohibited AI practices under Article 5 pose an unacceptable risk to Union values, human dignity, democracy, health, safety, and fundamental rights.",
        [
          "To reduce cloud computing electricity consumption across Europe.",
          "To reserve those AI capabilities exclusively for large tech companies.",
          "To replace GDPR data protection rules with a single licensing fee."
        ]
      ],
      [
        "Does calling a system 'experimental' automatically make a prohibited practice lawful?",
        "No, a label does not remove the prohibition.",
        "Article 5 prohibitions apply to placing on the market, putting into service, or using covered manipulative or harmful systems; relabelling a live deployment as 'beta' or 'experimental' does not exempt it.",
        [
          "Yes, any system marked 'beta' is exempt for up to three years.",
          "Yes, if users click an acknowledgement banner before starting.",
          "Yes, provided no subscription fee is charged to end users."
        ]
      ]
    ],
    3: [
      [
        "Can AI used as a safety component of certain regulated products be high-risk?",
        "Yes, when the Act's product-related conditions are met.",
        "Under Article 6(1), an AI system is high-risk if it is a safety component of a product (or is itself a product) covered by Union harmonisation legislation in Annex I and requires third-party conformity assessment.",
        [
          "No, physical products are regulated only by mechanical safety laws.",
          "Only if the product is manufactured outside the European Union.",
          "No, safety components are always classified as minimal-risk AI."
        ]
      ],
      [
        "Is AI used to evaluate access to education potentially high-risk?",
        "Yes, certain education and vocational-training uses are listed as high-risk.",
        "Annex III Point 3 lists AI systems intended to determine admission or assign persons to educational and vocational training institutions, or to evaluate learning outcomes, as high-risk.",
        [
          "No, educational tools are completely excluded from the EU AI Act.",
          "Only when used by private universities charging tuition fees.",
          "No, unless the system also uses real-time biometric identification."
        ]
      ],
      [
        "Can AI used in recruitment be high-risk?",
        "Yes, specified employment and worker-management uses are high-risk.",
        "Annex III Point 4 classifies AI systems used for recruitment, screening or filtering job applications, and making decisions on promotion or termination as high-risk.",
        [
          "No, human-resources software is treated as purely administrative.",
          "Only if the company employs more than 10,000 workers in Europe.",
          "No, provided a human recruiter signs the final rejection letter."
        ]
      ],
      [
        "Are some AI systems for essential private or public services high-risk?",
        "Yes, specified access and eligibility decisions are listed.",
        "Annex III Point 5 covers AI systems used to evaluate eligibility for essential public assistance benefits, creditworthiness/credit scoring, risk assessment in life and health insurance, and emergency call dispatching.",
        [
          "No, private banking and insurance tools are outside the Act's scope.",
          "Only when the service is operated directly by a central bank.",
          "No, credit scoring is regulated solely as a transparency-only chatbot."
        ]
      ],
      [
        "Can biometric uses fall into the high-risk category?",
        "Yes, certain biometric uses are listed as high-risk.",
        "Annex III Point 1 includes permitted remote biometric identification systems, biometric categorisation, and emotion-recognition systems (where not prohibited under Article 5) as high-risk.",
        [
          "No, every biometric system is either completely banned or unregulated.",
          "Only when used on smartphones to unlock a personal device.",
          "No, biometric systems require only a voluntary self-declaration."
        ]
      ],
      [
        "Are some AI systems used in law enforcement high-risk?",
        "Yes, specified law-enforcement uses are listed.",
        "Annex III Point 6 lists specific law-enforcement AI systems (such as evidence checks, lie detectors, and profiling in criminal cases) as high-risk.",
        [
          "No, law-enforcement agencies are exempt from all AI Act obligations.",
          "Only when the software is developed by a commercial foreign vendor.",
          "No, all law-enforcement AI is prohibited without exception."
        ]
      ],
      [
        "Can AI used in migration, asylum or border control be high-risk?",
        "Yes, specified uses are listed as high-risk.",
        "Annex III Point 7 designates AI systems assisting competent public authorities in examining asylum, visa, and residence applications or detecting document fraud as high-risk.",
        [
          "No, border-control systems are governed only by bilateral treaties.",
          "Only if the AI makes a decision without any database connection.",
          "No, migration tools are classified as general-purpose minimal-risk AI."
        ]
      ],
      [
        "Are some AI tools used in administration of justice high-risk?",
        "Yes, specified justice and democratic-process uses are listed.",
        "Annex III Point 8 covers AI systems intended to assist judicial authorities in researching and interpreting facts and the law, or in applying the law to a concrete set of facts, as well as systems influencing election outcomes.",
        [
          "No, courtroom software is treated as ordinary word-processing software.",
          "Only if the AI system replaces the judge completely without appeal.",
          "No, judicial tools only need a copyright policy summary."
        ]
      ],
      [
        "Does 'high-risk' mean every use of the system is banned?",
        "No, high-risk systems may be allowed if the applicable requirements are met.",
        "High-risk AI systems are not prohibited; they are permitted on the EU market provided they satisfy strict requirements on risk management, data governance, documentation, transparency, human oversight, accuracy, and robustness.",
        [
          "Yes, high-risk is another term for prohibited unacceptable-risk AI.",
          "Yes, unless the provider obtains a special exemption from parliament.",
          "No, high-risk systems have no legal duties until a complaint is filed."
        ]
      ],
      [
        "What should be checked before calling an AI system high-risk?",
        "Its intended purpose and the Act's classification rules.",
        "Article 6 and Annexes I and III determine high-risk status based on the system's intended purpose, its role as a regulated product safety component, or its use in listed high-risk areas.",
        [
          "Only the number of parameters and GPU hours used during training.",
          "Whether the user interface uses dark mode or light mode.",
          "Only the programming language in which the model was written."
        ]
      ]
    ],
    4: [
      [
        "When people interact directly with certain AI systems, what may providers need to ensure?",
        "People are informed that they are interacting with AI, unless this is obvious.",
        "Article 50(1) requires providers to design AI systems intended to interact directly with natural persons so that the persons concerned are informed they are interacting with an AI system, unless obvious from the circumstances.",
        [
          "People must pass a technical exam before using the AI interface.",
          "The provider must publish the full source code of the user interface.",
          "Users must sign a notarised consent form before every chat session."
        ]
      ],
      [
        "What is an example of content that may require disclosure under the Act?",
        "Certain AI-generated or manipulated deepfake content.",
        "Article 50(4) requires deployers of AI systems that generate or manipulate image, audio, or video content constituting a deepfake to disclose that the content has been artificially generated or manipulated.",
        [
          "Handwritten notes scanned into a PDF document for archiving.",
          "Standard spreadsheet formulas that calculate monthly totals.",
          "Unedited photographs taken with a conventional digital camera."
        ]
      ],
      [
        "Why is transparency important for AI use?",
        "It helps people understand when AI is involved and assess its effects.",
        "Transparency obligations under Article 50 protect autonomy and prevent deception by ensuring individuals know when they interact with AI or consume synthetic media.",
        [
          "It guarantees that the AI model will never produce a factual error.",
          "It automatically exempts the provider from all data-protection laws.",
          "It replaces the need for cybersecurity or accuracy testing."
        ]
      ],
      [
        "Should a deployer of certain emotion-recognition systems tell affected people?",
        "Yes, the Act includes information duties for covered systems.",
        "Article 50(3) requires deployers of permitted emotion-recognition or biometric categorisation systems to inform the natural persons exposed to them about the operation of the system.",
        [
          "No, informing individuals is optional if the system runs in the background.",
          "Only after the person submits a formal freedom-of-information request.",
          "No, disclosure is required only for generative text chatbots."
        ]
      ],
      [
        "Is a clearly labelled AI chatbot generally more transparent than an undisclosed one?",
        "Yes, labelling helps people recognise that they are interacting with AI.",
        "Clear upfront labelling fulfils Article 50(1) by ensuring users immediately understand they are communicating with an AI system rather than a human agent.",
        [
          "No, labels confuse users and are discouraged by the EU AI Act.",
          "Only if the chatbot is used for high-risk medical diagnosis.",
          "No, disclosure is only required at the end of a conversation."
        ]
      ],
      [
        "Does transparency replace all other AI obligations?",
        "No, transparency is only one part of compliance.",
        "Article 50 transparency duties work together with (and do not replace) high-risk rules under Chapter III or general-purpose AI rules under Chapter V.",
        [
          "Yes, adding an AI watermark satisfies every requirement in the Act.",
          "Yes, transparent systems are never subject to market surveillance.",
          "Only for systems deployed by companies with fewer than 50 staff."
        ]
      ],
      [
        "What should people know about a deepfake in covered cases?",
        "That the content has been artificially generated or manipulated.",
        "Under Article 50(4), deployers must clearly and distinguishably disclose that deepfake image, audio, or video content has been artificially generated or manipulated.",
        [
          "The exact GPU cluster temperature during video rendering.",
          "The home address of every software engineer on the project.",
          "The monthly cloud-hosting invoice of the deploying company."
        ]
      ],
      [
        "Who may have transparency duties under the Act?",
        "Providers or deployers, depending on the type of system and use.",
        "Article 50 allocates specific obligations to providers (such as technical marking of synthetic outputs and interactive design) and to deployers (such as disclosing deepfakes and emotion recognition).",
        [
          "Only internet service providers and telecom carriers.",
          "Only end users who view AI content on their personal phones.",
          "Only national courts after a lawsuit has concluded."
        ]
      ],
      [
        "Is hiding AI involvement a good way to build user trust?",
        "No, clear disclosure supports informed use.",
        "Concealing AI interaction risks deceiving users and breaching Article 50, whereas clear disclosure enables informed choices and accountable AI adoption.",
        [
          "Yes, users prefer not knowing whether support agents are human or AI.",
          "Yes, the Act recommends hiding AI labels to improve engagement.",
          "It makes no difference because disclosure is never legally required."
        ]
      ],
      [
        "What is a useful transparency check before publishing AI content?",
        "Check whether the Act requires disclosure or machine-readable marking.",
        "Providers of generative AI must ensure outputs are marked in a machine-readable format as artificially generated (Article 50(2)), and deployers must check whether visible deepfake or public-interest text disclosures apply (Article 50(4)).",
        [
          "Check only whether the file size is smaller than 10 megabytes.",
          "Verify that the font colour matches the company brand guidelines.",
          "Ensure the content is published only during business hours."
        ]
      ]
    ],
    5: [
      [
        "What does GPAI stand for?",
        "General-purpose AI.",
        "Under Article 3(63), a general-purpose AI (GPAI) model displays significant generality, is capable of competently performing a wide range of distinct tasks, and can be integrated into a variety of downstream systems.",
        [
          "Government-Protected Automated Infrastructure.",
          "Global Privacy and Authentication Index.",
          "Guaranteed Precision Algorithmic Interface."
        ]
      ],
      [
        "Can a GPAI model be integrated into many different downstream systems?",
        "Yes, broad capability is a defining feature.",
        "GPAI models are trained on large amounts of data at scale and can serve as foundation models for numerous downstream applications across different sectors.",
        [
          "No, a GPAI model can perform only one fixed single-purpose task.",
          "Only if it is recompiled by a national competent authority first.",
          "No, downstream integration is prohibited under Chapter V."
        ]
      ],
      [
        "Do GPAI model providers have documentation duties under the Act?",
        "Yes, covered providers must draw up and keep technical documentation.",
        "Article 53(1)(a) requires providers of GPAI models to draw up and keep up-to-date technical documentation of the model, including its training and testing process and evaluation results.",
        [
          "No, GPAI providers are exempt from all documentation rules.",
          "Only after a downstream user experiences a system outage.",
          "No, documentation is required only for hardware manufacturers."
        ]
      ],
      [
        "Can GPAI models with systemic risk face additional obligations?",
        "Yes, additional evaluation and risk measures may apply.",
        "Article 55 imposes extra obligations on providers of GPAI models with systemic risk, including model evaluation, adversarial testing, assessing and mitigating systemic risks, incident reporting, and cybersecurity protection.",
        [
          "No, all GPAI models have identical obligations regardless of scale.",
          "They only need to pay a flat registration fee to the EU.",
          "No, systemic-risk models are automatically banned from Europe."
        ]
      ],
      [
        "Is every GPAI model automatically a prohibited AI system?",
        "No, GPAI is a separate category with its own obligations.",
        "Chapter V establishes tailored transparency, copyright, and documentation rules for GPAI models, with heightened duties for models posing systemic risk rather than banning them.",
        [
          "Yes, all foundation models are prohibited under Article 5.",
          "Yes, unless they are trained exclusively on synthetic numbers.",
          "No, GPAI models are completely unregulated by the EU AI Act."
        ]
      ],
      [
        "Why should downstream providers receive information about a GPAI model?",
        "So they can understand its capabilities and limits and meet their own duties.",
        "Article 53(1)(b) requires GPAI model providers to supply information and documentation to downstream providers so they can understand the model's capabilities and limitations and comply with their own AI Act obligations.",
        [
          "So downstream providers can copy the provider's trademark and logo.",
          "To allow downstream providers to bypass high-risk conformity checks.",
          "Only to calculate marketing commissions between software vendors."
        ]
      ],
      [
        "What kind of policy must covered GPAI providers put in place concerning copyright?",
        "A policy to comply with EU copyright law.",
        "Article 53(1)(c) requires providers of GPAI models to put in place a policy to comply with Union law on copyright and related rights, including respecting text-and-data-mining opt-outs.",
        [
          "A policy declaring that all training data enters the public domain.",
          "A policy transferring all user copyrights to the model provider.",
          "No copyright policy is needed if the model is trained outside the EU."
        ]
      ],
      [
        "What must covered GPAI providers publish about training content?",
        "A sufficiently detailed summary of the content used for training, using the required template.",
        "Article 53(1)(d) requires GPAI model providers to draw up and make publicly available a sufficiently detailed summary about the content used for training the model, according to a template provided by the AI Office.",
        [
          "The complete raw copy of every copyrighted book and article used.",
          "Nothing; training data summaries are optional trade secrets.",
          "Only the total file size in terabytes without describing data sources."
        ]
      ],
      [
        "Is systemic risk assessment relevant to some powerful GPAI models?",
        "Yes, the Act has rules for GPAI models with systemic risk.",
        "Under Articles 51 and 55, GPAI models with high-impact capabilities (or designated criteria) are classified as GPAI models with systemic risk and must undergo continuous systemic-risk assessment and mitigation.",
        [
          "No, systemic risk applies only to banking and financial legislation.",
          "Only if the model is deployed on personal mobile devices.",
          "No, the Act evaluates only the visual design of the application."
        ]
      ],
      [
        "Can a code of practice help demonstrate compliance with GPAI obligations?",
        "Yes, codes of practice can support compliance.",
        "Under Article 56, the AI Office facilitates the drawing up of codes of practice that GPAI providers may rely on to demonstrate compliance with their obligations under Articles 53 and 55 until harmonised standards are published.",
        [
          "No, codes of practice are prohibited under the EU AI Act.",
          "Yes, signing a code of practice permanently replaces all EU laws.",
          "Only for companies that do not place models on the EU market."
        ]
      ]
    ],
    6: [
      [
        "Does the Act aim to support innovation as well as safety?",
        "Yes, it includes measures to support innovation.",
        "Article 1 and Chapter VI explicitly pair high levels of protection for health, safety, and fundamental rights with measures to support innovation, especially for SMEs and start-ups.",
        [
          "No, the Act focuses exclusively on penalties and market bans.",
          "Only for state-owned enterprises and government laboratories.",
          "No, innovation support was removed from the final regulation."
        ]
      ],
      [
        "What is an AI regulatory sandbox?",
        "A controlled framework for developing, testing and validating AI under oversight.",
        "Under Article 57, an AI regulatory sandbox provides a controlled environment established by a competent authority that facilitates the safe development, training, testing, and validation of innovative AI systems before placement on the market.",
        [
          "An unregulated website where any banned AI can be sold to the public.",
          "A physical warehouse used to store retired computer servers.",
          "A marketing badge that permanently exempts a product from conformity assessment."
        ]
      ],
      [
        "Can small and medium-sized enterprises benefit from innovation-support measures?",
        "Yes, the Act includes SME-focused support.",
        "Article 62 sets out specific measures for SMEs, including start-ups, such as priority access to AI regulatory sandboxes, tailored awareness and training activities, and proportionate conformity-assessment fees.",
        [
          "No, sandboxes are reserved for corporations with over 5,000 employees.",
          "Only if the SME gives up ownership of its intellectual property.",
          "No, SMEs must pay double the standard conformity-assessment fees."
        ]
      ],
      [
        "Does participation in a sandbox remove every legal duty?",
        "No, participants must still respect applicable safeguards.",
        "Sandbox testing takes place under a specific plan agreed with competent authorities, and participants remain subject to supervision, fundamental-rights safeguards, and liability for harm caused to third parties (Article 57).",
        [
          "Yes, sandbox participants have total immunity from all EU laws.",
          "Yes, participants may freely deploy prohibited manipulative AI.",
          "Yes, data-protection rules are suspended inside a sandbox."
        ]
      ],
      [
        "Why can supervised testing help AI developers?",
        "It helps identify risks and improve compliance before wider deployment.",
        "Regulatory sandboxes foster legal certainty, help developers refine technical documentation and risk mitigation under regulatory guidance, and accelerate safe market entry.",
        [
          "It allows developers to skip writing any technical documentation.",
          "It guarantees automatic procurement contracts with EU institutions.",
          "It hides all system defects from market-surveillance authorities."
        ]
      ],
      [
        "Who establishes AI regulatory sandboxes under the Act?",
        "Member States' competent authorities, as provided by the Act.",
        "Article 57(1) requires Member States to ensure their competent authorities establish at least one AI regulatory sandbox at national level, which may also be created jointly with other Member States.",
        [
          "Any private social-media influencer who registers a domain name.",
          "Only commercial cloud-computing vendors located outside Europe.",
          "Individual consumers through an online voting portal."
        ]
      ],
      [
        "Can real-world testing of certain high-risk AI happen without safeguards?",
        "No, specific conditions and safeguards apply.",
        "Articles 60 and 61 allow testing of high-risk AI systems in real-world conditions only when strict conditions are met, including a real-world testing plan, authority registration, reversible predictions, and informed consent where applicable.",
        [
          "Yes, developers can test high-risk AI on the public without notice.",
          "Yes, as long as the test lasts less than five years.",
          "Yes, whenever the software is labelled as a university project."
        ]
      ],
      [
        "Should smaller AI businesses have access to clear compliance information?",
        "Yes, information and guidance help them meet requirements.",
        "Article 62 obliges Member States and the AI Office to provide communication channels, guidance, and standardised templates tailored to the needs of SMEs and start-ups.",
        [
          "No, compliance rules are kept confidential until an audit occurs.",
          "Only if they hire an external multinational law firm first.",
          "No, smaller businesses are expected to draft their own EU standards."
        ]
      ],
      [
        "Is innovation support intended only for the largest companies?",
        "No, SMEs and start-ups are specifically considered.",
        "Chapter VI specifically prioritises SMEs and start-ups to prevent compliance costs from creating barriers to entry in the European AI ecosystem.",
        [
          "Yes, only companies listed on major stock exchanges qualify.",
          "Yes, start-ups are barred from applying to regulatory sandboxes.",
          "Only companies that manufacture semiconductor hardware qualify."
        ]
      ],
      [
        "What is the goal of a regulatory sandbox?",
        "To encourage responsible innovation while protecting people.",
        "Article 57 states that sandboxes aim to foster innovation, facilitate the development and testing of compliant AI systems, enhance legal certainty, and share regulatory learning while protecting health, safety, and fundamental rights.",
        [
          "To delay all new AI products for at least ten years.",
          "To replace national courts with automated arbitration bots.",
          "To collect source code so competitors can copy it."
        ]
      ]
    ],
    7: [
      [
        "Which EU body helps coordinate AI Act implementation?",
        "The European AI Office.",
        "Established within the European Commission (Article 64), the AI Office oversees GPAI models, supports uniform application of the Act across Member States, and serves as the secretariat for EU-level governance.",
        [
          "The European Central Bank's Monetary Committee.",
          "The International Maritime Organization.",
          "The European Space Agency Launch Directorate."
        ]
      ],
      [
        "Do Member States designate national competent authorities?",
        "Yes, national authorities have implementation and oversight roles.",
        "Article 70 requires each Member State to establish or designate at least one notifying authority and at least one market-surveillance authority as national competent authorities to supervise application and enforcement.",
        [
          "No, all inspections are carried out exclusively from Brussels.",
          "Only Member States with populations over 50 million do so.",
          "No, private trade associations act as the sole national regulators."
        ]
      ],
      [
        "What is the European Artificial Intelligence Board?",
        "A body supporting consistent application of the Act across the EU.",
        "Under Articles 65 and 66, the European Artificial Intelligence Board (with one member from each EU country) advises and helps the Commission and Member States apply the Act evenly.",
        [
          "A corporate board of directors elected by AI software vendors.",
          "A criminal court that sentences individual software engineers.",
          "A venture-capital fund that buys shares in AI start-ups."
        ]
      ],
      [
        "Are market-surveillance authorities relevant to AI Act enforcement?",
        "Yes, they monitor and enforce applicable requirements.",
        "Market-surveillance authorities investigate non-compliance, request technical documentation, require corrective actions, and can order the withdrawal or recall of non-compliant AI systems (Articles 74–79).",
        [
          "No, they only regulate agricultural imports and food packaging.",
          "Only when an AI system is sold in physical retail boxes.",
          "No, enforcement is left entirely to voluntary user reviews."
        ]
      ],
      [
        "Who is responsible for meeting a provider's obligations?",
        "The provider, for the obligations that apply to it.",
        "Under Article 16, providers of high-risk AI systems bear primary responsibility for ensuring their systems comply with Chapter III requirements, undergo conformity assessment, and carry CE marking.",
        [
          "Only the end consumer who downloads the mobile app.",
          "The electricity company supplying power to the data centre.",
          "No one, because AI obligations are shared equally by the public."
        ]
      ],
      [
        "Can deployers also have legal obligations?",
        "Yes, covered deployers have duties under the Act.",
        "Article 26 imposes clear obligations on deployers of high-risk AI systems, including using systems according to instructions, assigning competent human oversight, monitoring operation, keeping logs, and conducting fundamental-rights impact assessments where required.",
        [
          "No, once a system is purchased, the deployer has zero legal duties.",
          "Only if the deployer rewrites the underlying neural-network weights.",
          "No, deployers are only responsible for paying software licence fees."
        ]
      ],
      [
        "Why does governance involve more than one institution?",
        "Different EU and national bodies have distinct coordination and enforcement roles.",
        "The EU AI Act combines central Union-level supervision (such as the AI Office for GPAI models and the AI Board for coordination) with decentralised national market surveillance and fundamental-rights protection authorities.",
        [
          "So that companies can choose whichever regulator has the lowest standards.",
          "Because every EU city must write its own separate AI definition.",
          "To ensure no single authority ever has power to enforce the rules."
        ]
      ],
      [
        "Can a company ignore regulatory requests about a covered high-risk system?",
        "No, applicable cooperation duties must be respected.",
        "Providers and deployers must cooperate with competent authorities, provide requested documentation and logs, and grant access to data or models when necessary for compliance verification (Articles 16, 21, and 26).",
        [
          "Yes, requests from national authorities are purely voluntary surveys.",
          "Yes, if the company marks its emails as confidential.",
          "Yes, unless the request is signed by every EU Head of State."
        ]
      ],
      [
        "What is a key aim of EU-wide coordination?",
        "More consistent implementation across Member States.",
        "Harmonised governance prevents fragmented national rules, protects the internal market, and ensures equal protection of fundamental rights across all 27 Member States.",
        [
          "Ensuring each Member State enforces completely contradictory rules.",
          "Replacing all national languages with computer code in legal texts.",
          "Exempting cross-border digital services from oversight."
        ]
      ],
      [
        "Does governance mean only the developer is ever responsible?",
        "No, responsibility depends on each actor's role and applicable duties.",
        "The AI Act shares fair duties across the whole chain, including providers, deployers, importers, distributors, and product makers (Articles 16–27).",
        [
          "Yes, importers, distributors, and deployers never have obligations.",
          "Yes, only the individual coder who wrote the training script is liable.",
          "No, only the end individual affected by the decision is responsible."
        ]
      ]
    ],
    8: [
      [
        "Can people affected by certain AI decisions have a right to an explanation?",
        "Yes, in the circumstances specified by the Act.",
        "Article 86 grants affected persons subject to a decision taken by a deployer on the basis of output from certain high-risk AI systems the right to obtain clear and meaningful explanations of the role of the AI system and the main elements of the decision.",
        [
          "No, the Act forbids explaining how automated decisions are made.",
          "Only if the affected person holds a degree in computer science.",
          "Only when the decision involves a financial transaction over €1 million."
        ]
      ],
      [
        "Can a person submit a complaint about possible AI Act violations?",
        "Yes, the Act provides a route for complaints to market-surveillance authorities.",
        "Under Article 85, any natural or legal person having grounds to consider that there has been an infringement of the AI Act may submit a reasoned complaint to the relevant market-surveillance authority.",
        [
          "No, only government ministries are allowed to file complaints.",
          "Only after waiting five years from the date of the incident.",
          "No, complaints can be filed only by the AI provider itself."
        ]
      ],
      [
        "Why are enforcement mechanisms important?",
        "They help make AI rules effective in practice.",
        "Without monitoring, complaint channels, corrective powers, and proportionate penalties, legal requirements on safety, transparency, and fundamental rights would lack practical deterrence and remedy.",
        [
          "They are designed only to generate tax revenue from startups.",
          "They eliminate the need for providers to test their systems first.",
          "They allow regulators to write commercial software for private firms."
        ]
      ],
      [
        "Are penalties possible for breaches of the AI Act?",
        "Yes, the Act provides for administrative fines and other measures.",
        "Articles 99 and 101 set step-by-step fines (up to €35 million or 7% of global annual revenue for banned practices) based on how serious and long the breach is, with fair limits for small businesses.",
        [
          "No, the Act relies solely on non-binding polite reminders.",
          "Penalties apply only to individual hobbyists using AI at home.",
          "Only a fixed €50 fine is possible regardless of the violation."
        ]
      ],
      [
        "Does a person need to be an AI developer to raise a concern?",
        "No, affected people can have rights and complaint routes.",
        "Articles 85 and 86 let any affected person or organization (and whistleblowers under Article 87) report breaches or ask for an explanation without needing a technical background.",
        [
          "Yes, only certified machine-learning engineers have standing.",
          "Yes, complaints must include a mathematical proof of model bias.",
          "Only registered corporate lobbyists may contact authorities."
        ]
      ],
      [
        "Can authorities require corrective action for non-compliant AI?",
        "Yes, the Act includes market-surveillance and corrective powers.",
        "Under Article 79, where an AI system presents a risk or is non-compliant, market-surveillance authorities can require the operator to take corrective action, withdraw the system, or recall it within a reasonable period.",
        [
          "No, once an AI system is launched, authorities cannot require changes.",
          "Authorities can only publish an academic blog post about the issue.",
          "Only the original cloud hosting provider can order a recall."
        ]
      ],
      [
        "What should a deployer consider when AI affects an individual?",
        "Applicable transparency, oversight and fundamental-rights duties.",
        "Deployers of high-risk systems must ensure human oversight, monitor for risks to health, safety, or fundamental rights, inform affected individuals, and provide explanations when Article 86 applies.",
        [
          "Only whether the AI response was generated in less than one second.",
          "How to hide the involvement of AI so the person cannot ask questions.",
          "Whether the system's logo matches the current seasonal colour palette."
        ]
      ],
      [
        "Are the rights in the Act a promise that every AI output is perfect?",
        "No, they are legal protections and procedures, not a guarantee of perfection.",
        "The EU AI Act mitigates risks and establishes accountability, human oversight, and remedies, but no regulation can make statistical AI models 100% infallible in every scenario.",
        [
          "Yes, the Act legally guarantees zero errors in all AI predictions.",
          "Yes, any spelling mistake by a chatbot is an automatic felony.",
          "Yes, CE marking proves a model has 100% accuracy on all future data."
        ]
      ],
      [
        "Does enforcement apply only to companies based in one EU country?",
        "No, the Act's scope can reach actors in other countries in specified circumstances.",
        "Under Article 2, providers and deployers established in third countries are subject to the Act when they place AI systems on the Union market or when the output produced by their AI system is used in the Union.",
        [
          "Yes, relocating headquarters outside the EU removes all obligations.",
          "Yes, only companies registered in Luxembourg or Belgium are covered.",
          "Enforcement applies only to companies with no online presence."
        ]
      ],
      [
        "What is a responsible first step when an AI system appears to breach the rules?",
        "Document the concern and use the relevant complaint or oversight route.",
        "Keeping clear notes of the AI output, context, and impact (and reporting it through human review, provider support, or a market authority) helps fix the issue properly.",
        [
          "Delete all system logs immediately so no trace of the error remains.",
          "Ignore the issue unless it is reported on international television.",
          "Continue deploying the system while disabling human oversight."
        ]
      ]
    ]
  };

  const fallbackDistractors = [
    "No; the Act exempts commercial deployments from this requirement.",
    "Only when the AI system is operated exclusively offline.",
    "Yes, but only after a court issues a prior criminal conviction."
  ];

  export const buildQuestion = (pair: PromptSpec, position: number, stagePosition: number): Question => {
    const [prompt, correctAnswer, explanation, customDistractors] = pair;
    const pool = customDistractors && customDistractors.length >= 3 ? customDistractors : fallbackDistractors;
    const wrong = [0, 1, 2].map((offset) => pool[(position + offset) % pool.length]);
    const correctAt = (position + stagePosition + 1) % 4;
    const answers = wrong.slice();
    answers.splice(correctAt, 0, correctAnswer);
    return {
      q: prompt,
      a: answers,
      c: correctAt,
      why: explanation || correctAnswer
    };
  };

  export type BiText = string | { en: string; th: string };
  export type BiQuestion = {
    q: BiText;
    a: readonly BiText[];
    c: number;
    why: BiText;
  };

  const resolveBi = (val: BiText): string =>
    typeof val === "string" ? val : LearningHausI18n.t(val.en, val.th);

  const toQuestion = (bq: BiQuestion, seed: number): Question => {
    const mapped = bq.a.map(resolveBi);
    const len = Math.max(1, mapped.length);
    const rot = ((seed % len) + len) % len;
    const rotated = [...mapped.slice(rot), ...mapped.slice(0, rot)];
    const newCorrect = ((bq.c - rot) % len + len) % len;
    return {
      q: resolveBi(bq.q),
      a: rotated,
      c: newCorrect,
      why: resolveBi(bq.why)
    };
  };

  export const warmUpByChapter: Record<number, readonly BiQuestion[]> = {
    1: [
      {
        q: {
          en: "What is the primary focus difference between the EU AI Act and Thailand's PDPA?",
          th: "จุดโฟกัสหลักระหว่าง EU AI Act กับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ต่างกันอย่างไร?"
        },
        a: [
          {
            en: "The EU AI Act regulates AI systems by risk level, while PDPA protects personal data.",
            th: "EU AI Act กำกับดูแลตัวระบบ AI ตามระดับความเสี่ยง ส่วน PDPA คุ้มครองข้อมูลส่วนบุคคล"
          },
          {
            en: "The EU AI Act only regulates taxes, while PDPA only regulates hardware.",
            th: "EU AI Act กำกับเรื่องภาษีเท่านั้น ส่วน PDPA กำกับเฉพาะฮาร์ดแวร์"
          },
          {
            en: "Both laws only apply to social media influencers.",
            th: "กฎหมายทั้งสองฉบับบังคับใช้กับอินฟลูเอนเซอร์เท่านั้น"
          },
          {
            en: "PDPA replaces all AI safety rules automatically.",
            th: "PDPA เข้ามาแทนที่กฎความปลอดภัยด้าน AI ทั้งหมดโดยอัตโนมัติ"
          }
        ],
        c: 0,
        why: {
          en: "EU AI Act (Article 1) regulates AI systems and models by risk level, whereas PDPA governs lawful collection, use, and disclosure of personal data.",
          th: "EU AI Act (Article 1) วางกรอบความเสี่ยงและการกำกับดูแลตัวระบบ AI ขณะที่ PDPA คุ้มครองการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล"
        }
      },
      {
        q: {
          en: "A Thai startup builds an AI recruitment screener whose outputs are used by a company in Germany. Which law applies?",
          th: "สตาร์ทอัพในไทยพัฒนา AI คัดกรองผู้สมัครงาน และส่งผลลัพธ์ไปใช้ประเมินผู้สมัครในเยอรมนี กรณีนี้เข้าข่ายกฎหมายใด?"
        },
        a: [
          {
            en: "Only Thai law, because headquarters are in Thailand.",
            th: "เข้าข่ายเฉพาะกฎหมายไทย เพราะสำนักงานใหญ่อยู่ในประเทศไทย"
          },
          {
            en: "The EU AI Act also applies (Article 2) because the AI output is used in the EU.",
            th: "เข้าข่าย EU AI Act ด้วย (Article 2) แม้ผู้พัฒนาอยู่นอก EU แต่ผลลัพธ์ (Output) ถูกนำไปใช้ใน EU"
          },
          {
            en: "Neither law applies to recruitment software.",
            th: "ไม่เข้าข่ายกฎหมายใดเลยสำหรับซอฟต์แวร์คัดกรองงาน"
          },
          {
            en: "Only copyright law applies.",
            th: "เข้าข่ายเฉพาะกฎหมายลิขสิทธิ์เท่านั้น"
          }
        ],
        c: 1,
        why: {
          en: "Under Article 2, the EU AI Act has extraterritorial scope covering non-EU providers/deployers when their AI outputs are used in the EU.",
          th: "ตาม EU AI Act Article 2 กฎหมายมีผลบังคับใช้นอกอาณาเขต ครอบคลุมกรณีที่ผลลัพธ์ของระบบ AI ถูกนำไปใช้ในสหภาพยุโรป"
        }
      },
      {
        q: {
          en: "A private clinic buys a ready-made medical imaging AI software from a vendor to assist its doctors. What is the clinic's role?",
          th: "คลินิกเอกชนซื้อซอฟต์แวร์ AI ช่วยอ่านภาพถ่ายทางการแพทย์จากผู้ผลิต มาใช้งานในคลินิกของตนเอง คลินิกมีสถานะใด?"
        },
        a: [
          {
            en: "Provider",
            th: "Provider (ผู้พัฒนา/ผู้วางจำหน่าย)"
          },
          {
            en: "Deployer",
            th: "Deployer (ผู้ใช้งานระบบในองค์กรภายใต้การกำกับดูแลของตนเอง)"
          },
          {
            en: "European AI Office",
            th: "European AI Office"
          },
          {
            en: "Data Subject",
            th: "Data Subject (เจ้าของข้อมูล)"
          }
        ],
        c: 1,
        why: {
          en: "Under Article 3, a Deployer is an organization using an AI system under its authority in a professional context.",
          th: "ตาม Article 3 คลินิกที่นำระบบ AI มาใช้งานในองค์กรภายใต้การกำกับดูแลของตนเอง มีสถานะเป็น Deployer"
        }
      },
      {
        q: {
          en: "What does 'AI Literacy' under Article 4 require from providers and deployers?",
          th: "หลักการ 'การรู้เท่าทัน AI' (AI Literacy — Article 4) กำหนดให้ผู้พัฒนาและผู้ใช้งานดำเนินการอย่างไร?"
        },
        a: [
          {
            en: "Ensure staff and relevant people have skills and understanding of AI opportunities, risks, and potential harms.",
            th: "ส่งเสริมให้บุคลากรและผู้เกี่ยวข้องมีทักษะและความเข้าใจเรื่องโอกาส ความเสี่ยง และอันตรายที่อาจเกิดจาก AI"
          },
          {
            en: "Require every user to write neural networks from scratch in C++.",
            th: "บังคับให้ผู้ใช้ทุกคนต้องเขียนโค้ดโครงข่ายประสาทเทียมด้วยตนเอง"
          },
          {
            en: "Ban all employees from using computers.",
            th: "ห้ามพนักงานทุกคนใช้งานคอมพิวเตอร์"
          },
          {
            en: "Publish all corporate bank statements.",
            th: "เปิดเผยงบการเงินบริษัทต่อสาธารณะ"
          }
        ],
        c: 0,
        why: {
          en: "Article 4 obliges providers and deployers to promote AI literacy so users understand capabilities, risks, and safeguards.",
          th: "Article 4 มุ่งเน้นการสร้างทักษะ ความรู้ และความตระหนักรู้เรื่องโอกาส ความเสี่ยง และอันตรายจากการใช้ AI"
        }
      },
      {
        q: {
          en: "When does Thailand's PDPA (Section 5) apply to an organization located outside Thailand?",
          th: "ตาม PDPA มาตรา 5 องค์กรที่อยู่นอกประเทศไทยจะอยู่ภายใต้บังคับของ PDPA เมื่อใด?"
        },
        a: [
          {
            en: "When it collects, uses, or discloses personal data of individuals in Thailand to offer goods/services or monitor behavior in Thailand.",
            th: "เมื่อมีการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของเจ้าของข้อมูลในไทย เพื่อเสนอสินค้า/บริการ หรือเฝ้าติดตามพฤติกรรมในไทย"
          },
          {
            en: "Never; PDPA stops strictly at Thailand's physical border.",
            th: "ไม่มีทางเข้าข่าย เพราะ PDPA ใช้เฉพาะบริษัทที่จดทะเบียนในไทยเท่านั้น"
          },
          {
            en: "Only when the data is stored on paper.",
            th: "เฉพาะกรณีจัดเก็บข้อมูลในรูปแบบกระดาษเท่านั้น"
          },
          {
            en: "Only for companies founded before 2019.",
            th: "เฉพาะบริษัทที่ก่อตั้งก่อนปี 2562 เท่านั้น"
          }
        ],
        c: 0,
        why: {
          en: "PDPA Section 5 has extraterritorial scope covering offering goods/services or monitoring behavior of data subjects in Thailand.",
          th: "PDPA มาตรา 5 มีผลบังคับใช้นอกราชอาณาจักร หากมีการเสนอสินค้า/บริการ หรือเฝ้าติดตามพฤติกรรมของเจ้าของข้อมูลที่อยู่ในประเทศไทย"
        }
      }
    ],
    2: [
      {
        q: {
          en: "Why are certain AI practices banned outright under Article 5 (Unacceptable Risk)?",
          th: "เหตุใด EU AI Act (Chapter II, Article 5) จึงสั่งห้ามแนวปฏิบัติ AI บางประเภทโดยเด็ดขาด?"
        },
        a: [
          {
            en: "They contradict EU fundamental values and severely threaten safety, fundamental rights, and human autonomy.",
            th: "เพราะขัดต่อคุณค่าพื้นฐานของ EU และคุกคามความปลอดภัย สิทธิขั้นพื้นฐาน และความเป็นอิสระของมนุษย์อย่างร้ายแรง"
          },
          {
            en: "They consume too much electricity on weekends.",
            th: "เพราะใช้พลังงานไฟฟ้ามากเกินไปในวันหยุดสุดสัปดาห์"
          },
          {
            en: "They are older than five years.",
            th: "เพราะเป็นซอฟต์แวร์ที่มีอายุเกิน 5 ปี"
          },
          {
            en: "They lack dark mode in the user interface.",
            th: "เพราะไม่มีโหมดมืดในหน้าตาแอปพลิเคชัน"
          }
        ],
        c: 0,
        why: {
          en: "Unacceptable Risk AI threatens core rights and human dignity, so placing on the market or using them is banned under Article 5.",
          th: "ระบบความเสี่ยงที่ยอมรับไม่ได้ละเมิดสิทธิขั้นพื้นฐานและศักดิ์ศรีความเป็นมนุษย์อย่างร้ายแรง กฎหมายจึงห้ามจำหน่ายและใช้งานโดยตรง"
        }
      },
      {
        q: {
          en: "A company installs AI cameras to infer employees' facial emotions all day to decide annual bonuses. How is this classified?",
          th: "บริษัทติดตั้ง AI วิเคราะห์สีหน้าและอารมณ์พนักงานตลอดเวลาเพื่อใช้ประกอบการตัดโบนัสประจำปี กรณีนี้จัดเป็นอย่างไร?"
        },
        a: [
          {
            en: "Prohibited AI practice under Article 5 (workplace emotion inference outside medical/safety exceptions).",
            th: "เข้าข่าย AI ต้องห้ามตาม Article 5 (การอนุมานอารมณ์ในที่ทำงานโดยไม่เข้าข้อยกเว้นทางการแพทย์หรือความปลอดภัย)"
          },
          {
            en: "Minimal-risk productivity tool with zero restrictions.",
            th: "เป็นเครื่องมือเพิ่มประสิทธิภาพความเสี่ยงต่ำมากที่ใช้งานได้เสรี"
          },
          {
            en: "Automatic medical safety exception.",
            th: "เป็นข้อยกเว้นด้านความปลอดภัยทางการแพทย์โดยอัตโนมัติ"
          },
          {
            en: "Exempt because it only applies to employees.",
            th: "ได้รับยกเว้นเพราะใช้เฉพาะกับพนักงานภายใน"
          }
        ],
        c: 0,
        why: {
          en: "Article 5 bans workplace and school emotion recognition unless strictly used for medical or safety purposes.",
          th: "Article 5 ห้ามการตรวจจับอารมณ์ในที่ทำงานและสถานศึกษา ยกเว้นทำเพื่อวัตถุประสงค์ทางการแพทย์หรือความปลอดภัยเท่านั้น"
        }
      },
      {
        q: {
          en: "What legal risks arise when an organization scrapes faces from public websites without targeting to build a facial recognition database?",
          th: "การกวาดภาพใบหน้าคนจำนวนมากจากเว็บไซต์สาธารณะแบบไร้เป้าหมายเพื่อสร้างฐานข้อมูลจดจำใบหน้า มีความเสี่ยงทางกฎหมายใด?"
        },
        a: [
          {
            en: "Violates Article 5 ban on untargeted facial scraping and risks violating PDPA biometric/personal data rules.",
            th: "ผิดข้อห้ามการกวาดใบหน้าแบบไร้เป้าหมายตาม Article 5 และเสี่ยงละเมิดหลักการข้อมูลส่วนบุคคล/ข้อมูลชีวภาพตาม PDPA"
          },
          {
            en: "No risk because public web images are free to use for anything.",
            th: "ไม่มีความผิด เพราะภาพบนอินเทอร์เน็ตสาธารณะนำไปใช้ทำอะไรก็ได้"
          },
          {
            en: "Only needs a standard advertising permit.",
            th: "ต้องขอเฉพาะใบอนุญาตโฆษณาเท่านั้น"
          },
          {
            en: "Allowed automatically if blurred slightly.",
            th: "ทำได้ทันทีหากลดความชัดของภาพลงเล็กน้อย"
          }
        ],
        c: 0,
        why: {
          en: "Untargeted facial scraping is strictly banned by Article 5, and facial biometrics trigger strict PDPA lawful-basis requirements.",
          th: "การกวาดภาพใบหน้าแบบไม่เจาะจงเป้าหมายถูกห้ามเด็ดขาดตาม Article 5 และข้อมูลชีวภาพยังอยู่ภายใต้ PDPA อย่างเข้มงวด"
        }
      },
      {
        q: {
          en: "Which exception is explicitly recognized for emotion recognition in workplaces or schools under Article 5?",
          th: "ข้อยกเว้นใดที่ Article 5 อนุญาตให้ใช้ระบบตรวจจับอารมณ์ในสถานที่ทำงานหรือสถานศึกษาได้?"
        },
        a: [
          {
            en: "Medical or safety purposes (e.g., safety monitoring).",
            th: "วัตถุประสงค์ทางการแพทย์หรือความปลอดภัย (เช่น การเฝ้าระวังความปลอดภัย)"
          },
          {
            en: "Ranking employees for layoffs.",
            th: "การจัดอันดับพนักงานเพื่อเลิกจ้าง"
          },
          {
            en: "Targeted marketing to tired workers.",
            th: "การยิงโฆษณาตรงกลุ่มพนักงานที่ดูเหนื่อยล้า"
          },
          {
            en: "Grading student popularity.",
            th: "การให้คะแนนความนิยมของนักเรียน"
          }
        ],
        c: 0,
        why: {
          en: "Workplace/school emotion recognition is only permitted when carried out for medical or safety reasons.",
          th: "กฎหมายเปิดข้อยกเว้นให้ทำได้เฉพาะกรณีเพื่อวัตถุประสงค์ทางการแพทย์หรือความปลอดภัยเท่านั้น"
        }
      },
      {
        q: {
          en: "What does Article 5 prohibit regarding crime risk prediction?",
          th: "Article 5 ห้ามการประเมินความเสี่ยงการก่ออาชญากรรมในลักษณะใด?"
        },
        a: [
          {
            en: "Predicting crime risk solely based on profiling or assessing personality traits.",
            th: "การประเมินความเสี่ยงว่าบุคคลจะก่ออาชญากรรมโดยอาศัยเฉพาะการสร้างโปรไฟล์ (Profiling) หรือประเมินลักษณะบุคลิกภาพ"
          },
          {
            en: "Analyzing verified physical evidence of criminal conduct.",
            th: "การวิเคราะห์ข้อเท็จจริงหรือพฤติกรรมทางอาญาที่เป็นรูปธรรมและตรวจสอบได้"
          },
          {
            en: "Counting traffic accidents at an intersection.",
            th: "การนับสถิติอุบัติเหตุจราจรบริเวณทางแยก"
          },
          {
            en: "Checking whether a smoke alarm battery is low.",
            th: "การตรวจสอบแบตเตอรี่ของเครื่องตรวจจับควัน"
          }
        ],
        c: 0,
        why: {
          en: "Crime prediction solely via profiling/personality traits is banned, whereas objective, verifiable evidence-based analysis is not.",
          th: "ห้ามการทำนายอาชญากรรมจากโปรไฟล์หรือบุคลิกภาพเพียงอย่างเดียว แต่ไม่ห้ามการวิเคราะห์ที่อิงข้อเท็จจริงและพฤติกรรมที่ตรวจสอบได้"
        }
      }
    ],
    3: [
      {
        q: {
          en: "How does the EU AI Act treat High-Risk AI systems compared to Prohibited AI?",
          th: "EU AI Act ปฏิบัติต่อระบบ AI ความเสี่ยงสูง (High-Risk) แตกต่างจาก AI ต้องห้าม (Prohibited) อย่างไร?"
        },
        a: [
          {
            en: "High-risk AI is permitted if it meets strict safety, transparency, documentation, and oversight requirements.",
            th: "AI ความเสี่ยงสูงอนุญาตให้ใช้งานได้ หากปฏิบัติตามข้อกำหนดความปลอดภัย ความโปร่งใส เอกสาร และการกำกับโดยมนุษย์อย่างครบถ้วน"
          },
          {
            en: "Both are banned completely without exception.",
            th: "ถูกสั่งห้ามใช้งานทั้งหมดโดยไม่มีข้อยกเว้นเหมือนกัน"
          },
          {
            en: "High-risk AI has zero legal obligations.",
            th: "AI ความเสี่ยงสูงไม่มีข้อผูกพันทางกฎหมายใดๆ"
          },
          {
            en: "Only universities may sell high-risk AI.",
            th: "อนุญาตให้เฉพาะมหาวิทยาลัยเท่านั้นที่จำหน่ายได้"
          }
        ],
        c: 0,
        why: {
          en: "Unlike banned Article 5 practices, High-Risk AI (Chapter III, Annex III) can be marketed if lifecycle duties in Articles 8–15 are met.",
          th: "ต่างจาก Article 5 ที่ห้ามเด็ดขาด ระบบ High-Risk AI ใช้งานได้เมื่อผ่านเกณฑ์บังคับตลอดวงจรชีวิตตาม Chapter III (Articles 8–15)"
        }
      },
      {
        q: {
          en: "Which everyday HR use case falls under regulated High-Risk AI (Annex III)?",
          th: "การใช้งาน AI ด้านทรัพยากรบุคคล (HR) ในข้อใดจัดเป็น High-Risk AI ตาม Annex III?"
        },
        a: [
          {
            en: "AI tools used to screen, rank, or match job candidates.",
            th: "เครื่องมือ AI ที่ใช้คัดกรอง จัดอันดับ หรือจับคู่ผู้สมัครงาน"
          },
          {
            en: "An office calendar reminding staff of team birthdays.",
            th: "ปฏิทินสำนักงานแจ้งเตือนวันเกิดพนักงาน"
          },
          {
            en: "Spell-checking an internal newsletter.",
            th: "โปรแกรมตรวจคำสะกดในจดหมายข่าวภายใน"
          },
          {
            en: "Turning off meeting room lights automatically.",
            th: "ระบบปิดไฟห้องประชุมอัตโนมัติ"
          }
        ],
        c: 0,
        why: {
          en: "Employment/recruitment AI that screens or ranks candidates affects life opportunities and is regulated under Annex III.",
          th: "ระบบ AI คัดกรองหรือจัดอันดับผู้สมัครงานกระทบต่อโอกาสในชีวิต จึงจัดอยู่ในหมวด High-Risk AI ภายใต้ Annex III"
        }
      },
      {
        q: {
          en: "Under Article 25, when does a deployer, importer, or distributor become subject to full Provider obligations?",
          th: "ตาม Article 25 เมื่อใดที่ผู้ใช้งาน ผู้นำเข้า หรือผู้จัดจำหน่าย จะต้องรับภาระหน้าที่ในฐานะ Provider เต็มรูปแบบ?"
        },
        a: [
          {
            en: "When they put their name/trademark on a high-risk AI, change its intended purpose, or make a substantial modification.",
            th: "เมื่อนำชื่อ/เครื่องหมายการค้าตนเองมาติด ดัดแปลงวัตถุประสงค์เดิม หรือแก้ไขระบบอย่างมีนัยสำคัญ (Substantial Modification)"
          },
          {
            en: "Whenever they translate the user manual into another font.",
            th: "เมื่อเปลี่ยนฟอนต์ตัวอักษรในคู่มือการใช้งาน"
          },
          {
            en: "Whenever they plug the server into a backup battery.",
            th: "เมื่อเสียบปลั๊กเซิร์ฟเวอร์เข้ากับเครื่องสำรองไฟ"
          },
          {
            en: "Never; only the original creator can ever be a Provider.",
            th: "ไม่มีทางเกิดขึ้น เพราะผู้สร้างดั้งเดิมเท่านั้นที่เป็น Provider ได้"
          }
        ],
        c: 0,
        why: {
          en: "Article 25 shifts Provider duties onto any value-chain actor who rebrands, repurposes, or substantially modifies a high-risk AI.",
          th: "Article 25 กำหนดให้ผู้ที่นำแบรนด์ตนมาติด เปลี่ยนวัตถุประสงค์การใช้งาน หรือดัดแปลงระบบอย่างมีนัยสำคัญ ต้องรับหน้าที่แบบ Provider"
        }
      },
      {
        q: {
          en: "Before placing an Annex III high-risk AI system on the market, what verification & registration steps are required?",
          th: "ก่อนนำระบบ High-Risk AI ตาม Annex III ออกสู่ตลาด ต้องผ่านขั้นตอนตรวจสอบและขึ้นทะเบียนใดบ้าง?"
        },
        a: [
          {
            en: "Conformity assessment (Art. 43), EU Declaration of Conformity (Art. 47), CE marking (Art. 48), and EU Database registration (Art. 49/71).",
            th: "ประเมินความสอดคล้อง (Art. 43), ออกคำประกาศรับรอง EU (Art. 47), ติดเครื่องหมาย CE (Art. 48) และขึ้นทะเบียนใน EU Database (Art. 49/71)"
          },
          {
            en: "Only posting a screenshot on social media.",
            th: "เพียงโพสต์ภาพหน้าจอลงบนโซเชียลมีเดีย"
          },
          {
            en: "Paying a small parking fee at city hall.",
            th: "ชำระค่าธรรมเนียมจอดรถที่ศาลาว่าการ"
          },
          {
            en: "No pre-market steps are needed.",
            th: "ไม่ต้องผ่านขั้นตอนใดๆ ก่อนวางจำหน่าย"
          }
        ],
        c: 0,
        why: {
          en: "Chapter III Sections 4–5 and Article 71 mandate Conformity Assessment, Declaration of Conformity, CE marking, and EU Database registration.",
          th: "Chapter III ส่วนที่ 4–5 และ Article 71 กำหนดให้ต้องประเมินความสอดคล้อง ออก Declaration of Conformity ติด CE Marking และจดทะเบียนใน EU Database"
        }
      },
      {
        q: {
          en: "How do Article 10 of the EU AI Act and PDPA work together for high-risk AI datasets?",
          th: "Article 10 ของ EU AI Act และ PDPA ทำงานร่วมกันอย่างไรเมื่อระบบ High-Risk AI ใช้ชุดข้อมูลส่วนบุคคล?"
        },
        a: [
          {
            en: "Article 10 governs dataset quality and bias checks, while PDPA separately requires a valid lawful basis, safeguards, and data subject rights.",
            th: "Article 10 คุมคุณภาพชุดข้อมูลและลดอคติ ขณะที่ PDPA กำกับฐานกฎหมายในการเก็บ/ใช้/เปิดเผย ความปลอดภัย และสิทธิเจ้าของข้อมูลควบคู่กัน"
          },
          {
            en: "Passing Article 10 data checks automatically waives all PDPA obligations.",
            th: "หากผ่านเกณฑ์ Article 10 แล้วจะได้รับการยกเว้น PDPA ทั้งหมด"
          },
          {
            en: "PDPA only applies to non-digital paper files.",
            th: "PDPA บังคับใช้เฉพาะเอกสารกระดาษเท่านั้น"
          },
          {
            en: "Article 10 forbids testing datasets for bias.",
            th: "Article 10 ห้ามไม่ให้ตรวจสอบอคติในชุดข้อมูล"
          }
        ],
        c: 0,
        why: {
          en: "Both regimes apply in dual governance: AI data quality/bias mitigation (Art. 10) plus lawful personal data handling (PDPA).",
          th: "ทั้งสองกฎหมายบังคับใช้ควบคู่กัน: ควบคุมคุณภาพ/อคติของข้อมูล (Art. 10) พร้อมฐานกฎหมายและความปลอดภัยของข้อมูลส่วนบุคคล (PDPA)"
        }
      }
    ],
    4: [
      {
        q: {
          en: "Under Article 50(1), who must design chatbots so users know they are interacting with an AI system?",
          th: "ตาม Article 50(1) ใครมีหน้าที่ออกแบบแชทบอทให้ผู้ใช้งานทราบว่ากำลังโต้ตอบกับระบบ AI?"
        },
        a: [
          {
            en: "Providers (unless it is already obvious from the circumstances and context).",
            th: "Providers / ผู้พัฒนาระบบ (เว้นแต่จะชัดเจนอยู่แล้วจากบริบทและสถานการณ์การใช้งาน)"
          },
          {
            en: "Only the end-user reading the chat.",
            th: "ผู้ใช้ปลายทางที่อ่านแชทเพียงฝ่ายเดียว"
          },
          {
            en: "The internet service provider.",
            th: "ผู้ให้บริการอินเทอร์เน็ต"
          },
          {
            en: "No one; chatbots should pretend to be human.",
            th: "ไม่มีใครมีหน้าที่ แชทบอทควรแสร้งเป็นมนุษย์"
          }
        ],
        c: 0,
        why: {
          en: "Article 50(1) places the design duty on Providers to inform individuals they are interacting with an AI system.",
          th: "Article 50(1) กำหนดหน้าที่ให้ Providers ออกแบบระบบให้แจ้งผู้ใช้อย่างชัดเจนว่ากำลังโต้ตอบกับ AI"
        }
      },
      {
        q: {
          en: "What must Providers of synthetic audio, image, video, or text generators do under Article 50(2)?",
          th: "ตาม Article 50(2) ผู้พัฒนา AI ที่สร้างเนื้อหาสังเคราะห์ (เสียง ภาพ วิดีโอ หรือข้อความ) มีหน้าที่ใด?"
        },
        a: [
          {
            en: "Mark outputs in a machine-readable format so they are detectable as artificially generated or manipulated.",
            th: "ฝังเครื่องหมายหรือ Metadata ในรูปแบบที่เครื่องอ่านได้ (Machine-Readable) เพื่อให้ตรวจจับได้ว่าสร้างหรือดัดแปลงโดย AI"
          },
          {
            en: "Delete all generated images after 10 seconds.",
            th: "ลบภาพที่สร้างขึ้นทั้งหมดภายใน 10 วินาที"
          },
          {
            en: "Only generate black-and-white images.",
            th: "สร้างได้เฉพาะภาพขาวดำเท่านั้น"
          },
          {
            en: "Email every output to the AI Board.",
            th: "ส่งอีเมลผลงานทุกชิ้นให้ AI Board"
          }
        ],
        c: 0,
        why: {
          en: "Article 50(2) requires robust, interoperable machine-readable markings/watermarks on synthetic AI outputs.",
          th: "Article 50(2) กำหนดให้ฝังลายน้ำหรือ Metadata ที่เครื่องอ่านและตรวจสอบได้ว่าเป็นเนื้อหาที่สร้าง/ดัดแปลงโดย AI"
        }
      },
      {
        q: {
          en: "When publishing AI-generated text on matters of public interest, when is the Deployer exempt from disclosure under Article 50(4)?",
          th: "เมื่อผู้ใช้งาน (Deployer) เผยแพร่ข้อความที่สร้างโดย AI เกี่ยวกับเรื่องสาธารณะ กรณีใดที่ได้รับยกเว้นไม่ต้องติดป้ายแจ้งตาม Article 50(4)?"
        },
        a: [
          {
            en: "When the text underwent human review/editorial control and a natural or legal person holds editorial responsibility.",
            th: "เมื่อข้อความนั้นผ่านการตรวจทานและควบคุมทางบรรณาธิการโดยมนุษย์ และมีบุคคลหรือนิติบุคคลรับผิดชอบในฐานะบรรณาธิการ"
          },
          {
            en: "Whenever the text is shorter than 500 words.",
            th: "เมื่อข้อความสั้นกว่า 500 คำ"
          },
          {
            en: "Whenever it is posted on a Friday.",
            th: "เมื่อเผยแพร่ในวันศุกร์"
          },
          {
            en: "When the prompt was written in English.",
            th: "เมื่อเขียนคำสั่ง Prompt เป็นภาษาอังกฤษ"
          }
        ],
        c: 0,
        why: {
          en: "Article 50(4) exempts AI-assisted public-interest text if a human/legal entity exercised editorial control and holds responsibility.",
          th: "Article 50(4) ยกเว้นให้หากข้อความผ่านการตรวจทานควบคุมโดยมนุษย์และมีผู้รับผิดชอบทางบรรณาธิการชัดเจน"
        }
      },
      {
        q: {
          en: "When must transparency notices under Article 50(5) be provided?",
          th: "ตาม Article 50(5) ต้องแจ้งข้อมูลความโปร่งใสแก่ผู้ใช้งานเมื่อใด?"
        },
        a: [
          {
            en: "Clearly and distinguishably, at the latest at the time of the first interaction or exposure.",
            th: "ต้องแจ้งอย่างชัดเจน แยกแยะได้ง่าย อย่างช้าที่สุดในขณะที่โต้ตอบหรือรับชมเนื้อหานั้นเป็นครั้งแรก"
          },
          {
            en: "Hidden in page 40 of annual terms of service.",
            th: "ซ่อนไว้ในหน้า 40 ของข้อตกลงการใช้งานประจำปี"
          },
          {
            en: "Six months after the user stops using the service.",
            th: "หลังผู้ใช้เลิกใช้งานไปแล้ว 6 เดือน"
          },
          {
            en: "Only if the user files a lawsuit first.",
            th: "เฉพาะเมื่อผู้ใช้ยื่นฟ้องศาลก่อนเท่านั้น"
          }
        ],
        c: 0,
        why: {
          en: "Article 50(5) requires clear, accessible disclosure no later than first interaction or exposure.",
          th: "Article 50(5) กำหนดให้แจ้งอย่างชัดเจนและเข้าถึงได้ อย่างช้าที่สุด ณ เวลาที่โต้ตอบหรือรับสื่อครั้งแรก"
        }
      },
      {
        q: {
          en: "Does labeling a deepfake video under EU AI Act Article 50 allow using a real person's face without PDPA consent/lawful basis?",
          th: "การติดป้ายแจ้งเตือนว่าเป็นคลิป Deepfake ตาม Article 50 ทำให้สามารถนำใบหน้าของบุคคลจริงมาใช้โดยไม่ต้องมีฐานกฎหมายหรือความยินยอมตาม PDPA ได้หรือไม่?"
        },
        a: [
          {
            en: "No; disclosing AI origin under Article 50 does not authorize processing someone's likeness without a valid lawful basis or consent under PDPA.",
            th: "ไม่ได้ การเปิดเผยว่าเป็นสื่อ AI ตาม Article 50 ไม่ได้อนุญาตให้นำใบหน้าหรือเสียงบุคคลจริงมาใช้โดยไม่มีฐานกฎหมายหรือความยินยอมตาม PDPA"
          },
          {
            en: "Yes; an AI watermark overrides all personal data laws.",
            th: "ได้ เพราะลายน้ำ AI ยกเว้นกฎหมายข้อมูลส่วนบุคคลทั้งหมด"
          },
          {
            en: "Yes, if the video is under 60 seconds.",
            th: "ได้ หากวิดีโอสั้นกว่า 60 วินาที"
          },
          {
            en: "Only if the real person lives in another city.",
            th: "ได้ หากบุคคลนั้นอาศัยอยู่คนละจังหวัด"
          }
        ],
        c: 0,
        why: {
          en: "Deepfakes using real likenesses process personal/biometric data, so PDPA lawful basis or consent is still required alongside Article 50.",
          th: "Deepfake ที่ใช้ใบหน้า/เสียงบุคคลจริงเป็นการประมวลผลข้อมูลส่วนบุคคล จึงต้องมีฐานกฎหมายหรือความยินยอมตาม PDPA ควบคู่กันเสมอ"
        }
      }
    ],
    5: [
      {
        q: {
          en: "What defines a General-Purpose AI (GPAI) model under Chapter V of the EU AI Act?",
          th: "โมเดล AI อเนกประสงค์ (GPAI Model) ตาม Chapter V มีลักษณะสำคัญอย่างไร?"
        },
        a: [
          {
            en: "A versatile foundation model trained on vast datasets, capable of performing many distinct tasks across downstream apps.",
            th: "โมเดลพื้นฐานอเนกประสงค์ที่ฝึกบนชุดข้อมูลมหาศาล ทำงานได้หลากหลาย และนำไปต่อยอดในระบบปลายน้ำได้มากมาย"
          },
          {
            en: "A single-purpose thermostat that only turns on at 25°C.",
            th: "เทอร์โมสตัทที่ทำงานเดียวคือเปิดแอร์เมื่ออุณหภูมิถึง 25 องศา"
          },
          {
            en: "A static PDF reader with no AI.",
            th: "โปรแกรมอ่านไฟล์ PDF ธรรมดาที่ไม่มี AI"
          },
          {
            en: "A manual spreadsheet calculator.",
            th: "เครื่องคิดเลขตารางคำนวณแบบกรอกมือ"
          }
        ],
        c: 0,
        why: {
          en: "GPAI models display significant generality (such as LLMs and multimodal models) and integrate into many downstream applications.",
          th: "GPAI คือโมเดลพื้นฐานที่มีความสามารถหลากหลาย เช่น LLM และโมเดลมัลติโมดอล ที่นำไปประกอบในแอปพลิเคชันปลายทางได้หลากหลาย"
        }
      },
      {
        q: {
          en: "Under Article 51 and Annex XIII, when is a GPAI model presumed to pose 'systemic risk'?",
          th: "ตาม Article 51 และ Annex XIII โมเดล GPAI จะถูกสันนิษฐานว่ามี 'ความเสี่ยงเชิงระบบ' (Systemic Risk) เมื่อใด?"
        },
        a: [
          {
            en: "When cumulative training compute exceeds 10²⁵ FLOPs (or by Commission decision under Annex XIII criteria).",
            th: "เมื่อพลังประมวลผลสะสมในการฝึกโมเดลเกิน 10²⁵ FLOPs (หรือคณะกรรมาธิการยุโรปประกาศกำหนดตามเกณฑ์ Annex XIII)"
          },
          {
            en: "Whenever the model has more than 100 users.",
            th: "เมื่อมีผู้ใช้งานเกิน 100 คน"
          },
          {
            en: "When it is released as an open-source PDF.",
            th: "เมื่อเผยแพร่คู่มือเป็น PDF แบบโอเพนซอร์ส"
          },
          {
            en: "When its file size exceeds 50 MB.",
            th: "เมื่อไฟล์โมเดลมีขนาดเกิน 50 MB"
          }
        ],
        c: 0,
        why: {
          en: "Article 51(2) sets the quantitative presumption threshold at 10²⁵ FLOPs of cumulative compute used for training.",
          th: "Article 51(2) กำหนดเกณฑ์สันนิษฐานความเสี่ยงเชิงระบบที่พลังประมวลผลสะสมในการฝึกเกิน 10²⁵ FLOPs"
        }
      },
      {
        q: {
          en: "Which GPAI obligations apply to ALL GPAI model providers (Articles 53–54)?",
          th: "หน้าที่หลักใดที่ผู้พัฒนาโมเดล GPAI ทุกรายต้องปฏิบัติตาม (Articles 53–54)?"
        },
        a: [
          {
            en: "Technical docs (Annex XI), downstream info (Annex XII), EU copyright compliance policy, public training data summary, and EU Authorised Rep if outside EU.",
            th: "จัดทำเอกสารเทคนิค ข้อมูลให้ผู้พัฒนาปลายน้ำ นโยบายเคารพลิขสิทธิ์ EU สรุปข้อมูลฝึกอบรมต่อสาธารณะ และแต่งตั้งตัวแทนใน EU (หากอยู่นอก EU)"
          },
          {
            en: "Paying every user 100 EUR per prompt.",
            th: "จ่ายเงินให้ผู้ใช้คนละ 100 ยูโรต่อการถาม 1 ครั้ง"
          },
          {
            en: "Making all private customer prompts public.",
            th: "เปิดเผย Prompt ส่วนตัวของลูกค้าทุกคนต่อสาธารณะ"
          },
          {
            en: "Registering only with local sports clubs.",
            th: "จดทะเบียนเฉพาะกับสมาคมกีฬาท้องถิ่น"
          }
        ],
        c: 0,
        why: {
          en: "Articles 53–54 establish baseline documentation, copyright policy, public training summary, and EU authorised representative duties.",
          th: "Articles 53–54 กำหนดหน้าที่พื้นฐานด้านเอกสารเทคนิค เอกสารปลายน้ำ ลิขสิทธิ์ สรุปข้อมูลที่ใช้ฝึก และตัวแทนใน EU"
        }
      },
      {
        q: {
          en: "Which entity centrally supervises and enforces Chapter V GPAI obligations across the EU?",
          th: "หน่วยงานใดทำหน้าที่กำกับดูแลและบังคับใช้กฎเกณฑ์โมเดล GPAI (Chapter V) แบบรวมศูนย์ทั้ง EU?"
        },
        a: [
          {
            en: "The European Commission's AI Office (supported by the independent Scientific Panel).",
            th: "European AI Office ภายใต้คณะกรรมาธิการยุโรป (โดยมี Scientific Panel คอยสนับสนุนทางวิชาการ)"
          },
          {
            en: "Individual city parking authorities.",
            th: "หน่วยงานจราจรประจำเทศบาล"
          },
          {
            en: "Only private software vendors themselves.",
            th: "บริษัทซอฟต์แวร์เอกชนตรวจสอบกันเองเท่านั้น"
          },
          {
            en: "Local public libraries.",
            th: "ห้องสมุดประชาชนท้องถิ่น"
          }
        ],
        c: 0,
        why: {
          en: "Unlike high-risk systems enforced nationally, GPAI model obligations are enforced centrally by the AI Office.",
          th: "ต่างจากระบบ High-Risk ที่กำกับโดยหน่วยงานระดับประเทศ โมเดล GPAI ถูกกำกับดูแลแบบรวมศูนย์โดย AI Office"
        }
      },
      {
        q: {
          en: "Under PDPA, what happens when a Thai company sends customer prompts with personal data to an external GPAI API?",
          th: "ในมุมของ PDPA เมื่อองค์กรส่งข้อมูล Prompt ของลูกค้าที่มีข้อมูลส่วนบุคคลไปยัง API ของโมเดล GPAI ภายนอก จะเกิดหน้าที่ใด?"
        },
        a: [
          {
            en: "It triggers data controller/processor duties, lawful basis & transparency notice rules, and cross-border transfer requirements.",
            th: "ก่อให้เกิดหน้าที่ผู้ควบคุม/ผู้ประมวลผลข้อมูล ฐานกฎหมาย การแจ้งวัตถุประสงค์ และเกณฑ์การส่ง/โอนข้อมูลไปต่างประเทศตาม PDPA"
          },
          {
            en: "PDPA never applies to API calls.",
            th: "PDPA ไม่เคยบังคับใช้กับการเรียกใช้งาน API"
          },
          {
            en: "Only the EU AI Office checks Thai PDPA.",
            th: "มีเฉพาะ EU AI Office เท่านั้นที่ตรวจ PDPA ไทย"
          },
          {
            en: "No safeguards are needed if using HTTPS.",
            th: "หากใช้ HTTPS แล้วไม่จำเป็นต้องปฏิบัติตาม PDPA"
          }
        ],
        c: 0,
        why: {
          en: "Sending personal data in prompts to external GPAI APIs engages PDPA controller/processor accountability and cross-border transfer rules.",
          th: "การส่งข้อมูลส่วนบุคคลผ่าน Prompt ไปยังผู้ให้บริการ API ภายนอกอยู่ภายใต้กรอบหน้าที่ผู้ควบคุม/ผู้ประมวลผลและเกณฑ์โอนข้อมูลข้ามแดนของ PDPA"
        }
      }
    ],
    6: [
      {
        q: {
          en: "What is an AI Regulatory Sandbox under Articles 57–59?",
          th: "AI Regulatory Sandbox ตาม Articles 57–59 คืออะไร?"
        },
        a: [
          {
            en: "A controlled environment set up by authorities where innovators develop, train, and test AI under regulatory supervision for a limited time.",
            th: "พื้นที่ทดสอบแบบควบคุมที่หน่วยงานกำกับดูแลจัดตั้งขึ้น เพื่อให้ผู้พัฒนาสร้าง ฝึก และทดสอบ AI ภายใต้คำแนะนำอย่างใกล้ชิดในระยะเวลาจำกัด"
          },
          {
            en: "A permanent tax haven where all laws are abolished forever.",
            th: "เขตปลอดกฎหมายถาวรที่ยกเลิกกฎความปลอดภัยทั้งหมดตลอดไป"
          },
          {
            en: "A children's playground near Brussels.",
            th: "สนามเด็กเล่นในกรุงบรัสเซลส์"
          },
          {
            en: "A mandatory fee paid before buying a laptop.",
            th: "ค่าธรรมเนียมบังคับก่อนซื้อคอมพิวเตอร์"
          }
        ],
        c: 0,
        why: {
          en: "Sandboxes offer structured regulatory guidance and safe experimentation—Member States must have at least one operational by 2 August 2026.",
          th: "Sandbox ช่วยให้ทดลองและรับคำแนะนำจากผู้กำกับดูแลได้อย่างปลอดภัย โดยประเทศสมาชิกต้องมีอย่างน้อย 1 แห่งภายใน 2 ส.ค. 2026"
        }
      },
      {
        q: {
          en: "Under Article 57(12), what protection do sandbox participants receive if they follow the sandbox plan and authority guidance in good faith?",
          th: "ตาม Article 57(12) ผู้เข้าร่วม Sandbox ที่ปฏิบัติตามแผนและคำแนะนำของหน่วยงานโดยสุจริตจะได้รับความคุ้มครองใด?"
        },
        a: [
          {
            en: "No administrative fines are imposed for EU AI Act infringements during sandbox participation (though third-party harm liability remains).",
            th: "ไม่ถูกปรับทางปกครองตาม EU AI Act ระหว่างเข้าร่วม (แต่ยังคงต้องรับผิดตามกฎหมายหากก่อให้เกิดความเสียหายต่อบุคคลภายนอก)"
          },
          {
            en: "Complete immunity from all civil, criminal, and third-party harm claims.",
            th: "ได้รับความคุ้มกันไม่ผิดทั้งทางแพ่ง อาญา และความเสียหายต่อบุคคลภายนอกทุกกรณี"
          },
          {
            en: "Free lifetime cloud servers from the EU.",
            th: "ได้รับเซิร์ฟเวอร์คลาวด์ฟรีตลอดชีวิตจาก EU"
          },
          {
            en: "Automatic CE marking without testing.",
            th: "ได้รับเครื่องหมาย CE ทันทีโดยไม่ต้องทดสอบ"
          }
        ],
        c: 0,
        why: {
          en: "Article 57(12) waives EU AI Act administrative fines for good-faith sandbox participants while preserving third-party liability.",
          th: "Article 57(12) ยกเว้นโทษปรับทางปกครองของ EU AI Act ให้ผู้ปฏิบัติตามแผนโดยสุจริต แต่ยังรับผิดต่อความเสียหายของบุคคลภายนอก"
        }
      },
      {
        q: {
          en: "What is the maximum duration for real-world testing of high-risk AI outside sandboxes under Article 60(4)(g)?",
          th: "ตาม Article 60(4)(g) การทดสอบระบบ High-Risk AI ในสภาพแวดล้อมจริงนอก Sandbox ทำได้นานสูงสุดเท่าใด?"
        },
        a: [
          {
            en: "Up to 6 months, extendable once for an additional 6 months upon prior notification.",
            th: "ไม่เกิน 6 เดือน และขยายเวลาได้อีก 1 ครั้งไม่เกิน 6 เดือนเมื่อแจ้งล่วงหน้า"
          },
          {
            en: "Up to 10 years without renewal.",
            th: "นานสูงสุด 10 ปีโดยไม่ต้องแจ้ง"
          },
          {
            en: "Only 24 hours.",
            th: "ได้เพียง 24 ชั่วโมงเท่านั้น"
          },
          {
            en: "Unlimited duration.",
            th: "ไม่จำกัดระยะเวลา"
          }
        ],
        c: 0,
        why: {
          en: "Article 60(4)(g) caps real-world testing at 6 months (extendable once by 6 months) and requires reversibility and informed consent.",
          th: "Article 60(4)(g) จำกัดเวลาทดสอบจริงไว้ที่ 6 เดือน (ขยายได้อีก 1 ครั้ง 6 เดือน) พร้อมเงื่อนไขย้อนกลับผลลัพธ์ได้และได้รับความยินยอม"
        }
      },
      {
        q: {
          en: "How do Articles 62–63 and 99(6) specifically support SMEs, start-ups, and microenterprises?",
          th: "Articles 62–63 และ 99(6) ช่วยเหลือ SMEs สตาร์ทอัพ และวิสาหกิจขนาดจิ๋ว (Microenterprises) อย่างไร?"
        },
        a: [
          {
            en: "Priority sandbox access, proportionate fee reductions, simplified tech docs/QMS options, and applying the lower fine cap.",
            th: "สิทธิเข้า Sandbox ก่อน ลดค่าธรรมเนียมตามขนาด มีแบบฟอร์มเอกสาร/QMS แบบย่อ และคำนวณเพดานค่าปรับตามเกณฑ์ที่ต่ำกว่า"
          },
          {
            en: "Charging SMEs double the fees of large tech giants.",
            th: "เก็บค่าธรรมเนียมจาก SMEs แพงกว่าบริษัทยักษ์ใหญ่ 2 เท่า"
          },
          {
            en: "Banning start-ups from building AI.",
            th: "ห้ามสตาร์ทอัพพัฒนา AI"
          },
          {
            en: "Exempting SMEs from all banned Article 5 rules.",
            th: "อนุญาตให้ SMEs ใช้ AI ต้องห้ามตาม Article 5 ได้"
          }
        ],
        c: 0,
        why: {
          en: "The Act prevents smaller innovators from being priced out via priority sandbox access, reduced fees, simplified forms, and lower fine caps.",
          th: "กฎหมายช่วยลดภาระผู้ประกอบการรายย่อยด้วยสิทธิเข้า Sandbox ก่อน ลดค่าธรรมเนียม เอกสารแบบย่อ และเพดานค่าปรับที่ต่ำกว่า"
        }
      },
      {
        q: {
          en: "Even when Article 59 allows reusing personal data in a public-interest sandbox, what does PDPA still require?",
          th: "แม้ Article 59 จะเปิดช่องให้นำข้อมูลส่วนบุคคลมาใช้ต่อใน Sandbox เพื่อประโยชน์สาธารณะได้ แต่ในมุม PDPA องค์กรยังต้องทำอะไร?"
        },
        a: [
          {
            en: "Verify a valid PDPA lawful basis (e.g., consent/Sec. 24(1)/Sec. 26 for sensitive data), privacy notice (Sec. 23), minimization, and deletion.",
            th: "ตรวจสอบฐานกฎหมายตาม PDPA (เช่น ความยินยอม, ม.24(1) หรือ ม.26 สำหรับข้อมูลอ่อนไหว) แจ้ง Privacy Notice (ม.23) ลดข้อมูลเท่าที่จำเป็น และลบเมื่อจบ"
          },
          {
            en: "Post the raw personal dataset on GitHub.",
            th: "อัปโหลดชุดข้อมูลส่วนบุคคลขึ้น GitHub แบบสาธารณะ"
          },
          {
            en: "Skip consent because sandboxes never touch privacy law.",
            th: "ไม่ต้องขอความยินยอมใดๆ เพราะ Sandbox ไม่อยู่ใต้ PDPA"
          },
          {
            en: "Keep personal records forever after testing ends.",
            th: "เก็บข้อมูลส่วนบุคคลไว้ถาวรแม้ทดสอบเสร็จสิ้นแล้ว"
          }
        ],
        c: 0,
        why: {
          en: "PDPA Sections 19, 23, 24, and 26 apply alongside sandbox technical safeguards, data minimization, logging, and deletion.",
          th: "องค์กรยังต้องปฏิบัติตาม PDPA มาตรา 19, 23, 24 และ 26 ควบคู่กับมาตรการแยกข้อมูล บันทึก Log และลบข้อมูลเมื่อจบการทดสอบ"
        }
      }
    ],
    7: [
      {
        q: {
          en: "What is the two-tier governance structure under Chapter VII (Articles 64–70) of the EU AI Act?",
          th: "โครงสร้างการกำกับดูแลแบบ 2 ระดับ (Two-Tier Governance) ใน Chapter VII (Articles 64–70) ประกอบด้วยส่วนใดบ้าง?"
        },
        a: [
          {
            en: "Union-level bodies (AI Office, AI Board, Advisory Forum, Scientific Panel) paired with national competent authorities in each Member State.",
            th: "หน่วยงานระดับสหภาพยุโรป (AI Office, AI Board, Advisory Forum, Scientific Panel) ทำงานร่วมกับหน่วยงานกำกับระดับประเทศของแต่ละรัฐสมาชิก"
          },
          {
            en: "Only one single local town council in Paris.",
            th: "มีเพียงเทศบาลเมืองเดียวในกรุงปารีส"
          },
          {
            en: "Private tech CEOs voting on fines every month.",
            th: "กลุ่มผู้บริหารบริษัทเทคโนโลยีเอกชนโหวตกำหนดค่าปรับกันเอง"
          },
          {
            en: "Social media moderators without legal powers.",
            th: "ผู้ดูแลเว็บบอร์ดโซเชียลที่ไม่มีอำนาจตามกฎหมาย"
          }
        ],
        c: 0,
        why: {
          en: "Chapter VII Section 1 establishes four Union-level bodies and Section 2 requires national notifying and market surveillance authorities.",
          th: "Chapter VII แบ่งเป็นหน่วยงานกลางระดับ EU (Section 1) และหน่วยงานกำกับระดับประเทศในแต่ละรัฐสมาชิก (Section 2)"
        }
      },
      {
        q: {
          en: "Which Union-level body consists of independent experts advising the AI Office and issuing qualified alerts on systemic risks?",
          th: "หน่วยงานระดับ EU ใดประกอบด้วยผู้เชี่ยวชาญอิสระที่ให้คำแนะนำ AI Office และแจ้งเตือนความเสี่ยงเชิงระบบ (Qualified Alerts)?"
        },
        a: [
          {
            en: "The Scientific Panel of Independent Experts (Articles 68–69).",
            th: "Scientific Panel of Independent Experts (คณะผู้เชี่ยวชาญทางวิทยาศาสตร์อิสระ — Articles 68–69)"
          },
          {
            en: "The Advisory Forum (stakeholder group).",
            th: "Advisory Forum (กลุ่มตัวแทนผู้มีส่วนได้ส่วนเสีย)"
          },
          {
            en: "A national notifying authority.",
            th: "Notifying Authority ระดับประเทศ"
          },
          {
            en: "The European Patent Office.",
            th: "สำนักงานสิทธิบัตรยุโรป"
          }
        ],
        c: 0,
        why: {
          en: "The Scientific Panel (Articles 68–69) provides independent technical expertise, issues systemic risk alerts, and supports market surveillance.",
          th: "Scientific Panel (Articles 68–69) คัดเลือกผู้เชี่ยวชาญอิสระมาให้คำปรึกษาด้าน GPAI และออกคำเตือนความเสี่ยงเชิงระบบ"
        }
      },
      {
        q: {
          en: "Who represents stakeholder groups (industry, start-ups, SMEs, civil society, academia) to advise the AI Board and Commission?",
          th: "หน่วยงานใดรวมตัวแทนจากภาคอุตสาหกรรม สตาร์ทอัพ SMEs ประชาสังคม และนักวิชาการ เพื่อเสนอความเห็นต่อ AI Board?"
        },
        a: [
          {
            en: "The Advisory Forum (Article 67).",
            th: "Advisory Forum (เวทีที่ปรึกษาผู้มีส่วนได้ส่วนเสีย — Article 67)"
          },
          {
            en: "The Scientific Panel only.",
            th: "เฉพาะ Scientific Panel"
          },
          {
            en: "Customs border guards.",
            th: "เจ้าหน้าที่ศุลกากรชายแดน"
          },
          {
            en: "Company internal auditors.",
            th: "ผู้ตรวจสอบบัญชีภายในบริษัท"
          }
        ],
        c: 0,
        why: {
          en: "Article 67 establishes the Advisory Forum to bring balanced industry, SME, civil society, and academic perspectives.",
          th: "Article 67 จัดตั้ง Advisory Forum เพื่อนำมุมมองที่สมดุลจากภาคธุรกิจ SMEs ประชาสังคม และนักวิชาการมาให้คำแนะนำ"
        }
      },
      {
        q: {
          en: "Under Article 70(1), what are the two distinct national authorities each EU Member State must designate?",
          th: "ตาม Article 70(1) รัฐสมาชิก EU แต่ละประเทศต้องจัดตั้งหรือกำหนดหน่วยงานระดับชาติ 2 ประเภทใด?"
        },
        a: [
          {
            en: "At least one Notifying Authority (monitors conformity assessment bodies) and at least one Market Surveillance Authority (supervises AI on the market & complaints).",
            th: "Notifying Authority (กำกับหน่วยประเมินความสอดคล้อง) และ Market Surveillance Authority (กำกับระบบ AI ในตลาดและรับเรื่องร้องเรียน)"
          },
          {
            en: "A gaming league and a cinema board.",
            th: "สมาคมอีสปอร์ตและคณะกรรมการภาพยนตร์"
          },
          {
            en: "Only a tax office and a postal office.",
            th: "สำนักงานสรรพากรและไปรษณีย์เท่านั้น"
          },
          {
            en: "Private marketing agencies.",
            th: "บริษัทเอเจนซี่โฆษณาเอกชน"
          }
        ],
        c: 0,
        why: {
          en: "Article 70(1) mandates at least one Notifying Authority and one Market Surveillance Authority (with one acting as Single Point of Contact).",
          th: "Article 70(1)–(2) กำหนดให้มีทั้ง Notifying Authority และ Market Surveillance Authority พร้อมจุดประสานงานกลาง (Single Point of Contact)"
        }
      },
      {
        q: {
          en: "In Thailand, if an AI system processes personal data of individuals in Thailand, which data regulator retains jurisdiction alongside AI rules?",
          th: "ในประเทศไทย หากระบบ AI มีการประมวลผลข้อมูลส่วนบุคคลของประชาชนในไทย หน่วยงานกำกับดูแลด้านข้อมูลใดมีอำนาจกำกับควบคู่กัน?"
        },
        a: [
          {
            en: "Thailand's Personal Data Protection Committee (PDPC) and the Office of the PDPC.",
            th: "คณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส. / PDPC) และสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล"
          },
          {
            en: "Only the EU AI Board in Brussels.",
            th: "เฉพาะ AI Board ในกรุงบรัสเซลส์เท่านั้น"
          },
          {
            en: "No regulator oversees personal data in AI.",
            th: "ไม่มีหน่วยงานใดกำกับดูแลข้อมูลส่วนบุคคลในระบบ AI"
          },
          {
            en: "Only the hardware manufacturer.",
            th: "เฉพาะผู้ผลิตฮาร์ดแวร์เท่านั้น"
          }
        ],
        c: 0,
        why: {
          en: "Thailand's PDPC retains full regulatory jurisdiction over personal data compliance whenever AI processes personal data in Thailand.",
          th: "คณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC) และสำนักงาน สคส. ยังคงมีอำนาจกำกับดูแลข้อมูลส่วนบุคคลควบคู่กับกฎเกณฑ์ AI เสมอ"
        }
      }
    ],
    8: [
      {
        q: {
          en: "Under Article 85, what can any natural or legal person do if they have grounds to believe the EU AI Act was infringed?",
          th: "ตาม Article 85 บุคคลธรรมดาหรือนิติบุคคลที่มีเหตุอันควรเชื่อว่ามีการฝ่าฝืน EU AI Act สามารถทำอะไรได้?"
        },
        a: [
          {
            en: "Submit a complaint to the relevant Market Surveillance Authority.",
            th: "ยื่นเรื่องร้องเรียน (Lodge a Complaint) ต่อ Market Surveillance Authority ที่เกี่ยวข้องได้"
          },
          {
            en: "Only complain privately to the AI chatbot.",
            th: "บ่นกับแชทบอทเป็นการส่วนตัวได้เท่านั้น"
          },
          {
            en: "Hack the provider's server to shut it down.",
            th: "แฮกเข้าไปปิดเซิร์ฟเวอร์ของผู้พัฒนาด้วยตนเอง"
          },
          {
            en: "Nothing; individuals have no complaint rights.",
            th: "ทำอะไรไม่ได้เลยเพราะไม่มีสิทธิร้องเรียน"
          }
        ],
        c: 0,
        why: {
          en: "Article 85 grants the Right to Lodge a Complaint to the market surveillance authority without prejudice to other remedies.",
          th: "Article 85 ให้สิทธิยื่นคำร้องเรียนต่อ Market Surveillance Authority โดยไม่ตัดสิทธิเยียวยาทางปกครองหรือศาลอื่น"
        }
      },
      {
        q: {
          en: "When does an individual have the Right to Explanation under Article 86?",
          th: "บุคคลที่ได้รับผลกระทบมี 'สิทธิขอคำอธิบาย' (Right to Explanation — Article 86) ในกรณีใด?"
        },
        a: [
          {
            en: "When a deployer's decision based on an Annex III high-risk AI produces legal or similarly significant adverse effects on health, safety, or rights.",
            th: "เมื่อถูกตัดสินใจโดยอิงผลลัพธ์จาก High-Risk AI (Annex III) จนเกิดผลทางกฎหมายหรือกระทบต่อสุขภาพ ความปลอดภัย หรือสิทธิขั้นพื้นฐานอย่างมีนัยสำคัญ"
          },
          {
            en: "When a music app recommends a pop song.",
            th: "เมื่อแอปฟังเพลงแนะนำเพลงป๊อปให้ฟัง"
          },
          {
            en: "When a weather app predicts light rain.",
            th: "เมื่อแอปพยากรณ์อากาศทายว่าฝนจะตกเล็กน้อย"
          },
          {
            en: "Never; explanations are strictly trade secrets.",
            th: "ไม่มีสิทธิ์ขอคำอธิบายใดๆ เพราะถือเป็นความลับทางการค้าทั้งหมด"
          }
        ],
        c: 0,
        why: {
          en: "Article 86 entitles affected persons to clear, meaningful explanations of AI's role and main elements of the adverse high-risk decision.",
          th: "Article 86 ให้สิทธิรับทราบคำอธิบายที่ชัดเจนและมีความหมายเกี่ยวกับบทบาทของ AI และองค์ประกอบหลักของการตัดสินใจนั้น"
        }
      },
      {
        q: {
          en: "What must high-risk AI providers do under Article 73 when a serious incident occurs (e.g., death, serious harm, or severe rights breach)?",
          th: "ตาม Article 73 เมื่อเกิด 'เหตุการณ์ร้ายแรง' (Serious Incident) เช่น เสียชีวิต บาดเจ็บร้ายแรง หรือละเมิดสิทธิอย่างหนัก ผู้พัฒนา High-Risk AI ต้องทำอย่างไร?"
        },
        a: [
          {
            en: "Report the serious incident to the relevant market surveillance authorities immediately after establishing a causal link.",
            th: "รายงานต่อ Market Surveillance Authority ทันทีหลังจากพบความเชื่อมโยงเชิงสาเหตุ (และภายในกำหนดเวลาที่กฎหมายระบุ)"
          },
          {
            en: "Delete the event logs to avoid embarrassment.",
            th: "ลบไฟล์ Log เหตุการณ์ทิ้งเพื่อหลีกเลี่ยงความอับอาย"
          },
          {
            en: "Wait five years before telling anyone.",
            th: "รออีก 5 ปีค่อยแจ้งหน่วยงาน"
          },
          {
            en: "Blame the user in social media comments.",
            th: "โทษผู้ใช้งานผ่านคอมเมนต์โซเชียลมีเดีย"
          }
        ],
        c: 0,
        why: {
          en: "Article 73 mandates prompt reporting of serious incidents (and Article 72 mandates ongoing post-market monitoring).",
          th: "Article 73 บังคับให้รายงานเหตุการณ์ร้ายแรงทันที พร้อมมีระบบติดตามผลหลังออกสู่ตลาด (Post-Market Monitoring) ตาม Article 72"
        }
      },
      {
        q: {
          en: "What is the maximum administrative fine for non-compliance with Prohibited AI Practices (Article 99(3))?",
          th: "โทษปรับทางปกครองสูงสุดสำหรับการฝ่าฝืนข้อห้าม AI ต้องห้าม (Prohibited AI — Article 99(3)) คือเท่าใด?"
        },
        a: [
          {
            en: "Up to EUR 35,000,000 or up to 7% of total worldwide annual turnover (whichever is higher for undertakings).",
            th: "สูงสุด 35,000,000 ยูโร หรือสูงสุด 7% ของรายได้รวมทั่วโลกต่อปี (แล้วแต่จำนวนใดสูงกว่าสำหรับองค์กร)"
          },
          {
            en: "Up to EUR 500 flat fee.",
            th: "ปรับคงที่สูงสุด 500 ยูโร"
          },
          {
            en: "Up to EUR 7,500,000 or 1% turnover.",
            th: "สูงสุด 7,500,000 ยูโร หรือ 1% ของรายได้"
          },
          {
            en: "A warning email only.",
            th: "ส่งอีเมลตักเตือนเท่านั้น"
          }
        ],
        c: 0,
        why: {
          en: "Chapter XII sets tiered fines: 35M/7% for Article 5 prohibited AI, 15M/3% for core & GPAI obligations, and 7.5M/1% for misleading info.",
          th: "Chapter XII แบ่งโทษปรับเป็นขั้น: 35M/7% สำหรับ AI ต้องห้าม, 15M/3% สำหรับหน้าที่หลักและ GPAI, และ 7.5M/1% สำหรับข้อมูลเท็จ"
        }
      },
      {
        q: {
          en: "What separate penalties can apply under Thailand's PDPA alongside EU AI Act enforcement when personal data is misused?",
          th: "หากนำข้อมูลส่วนบุคคลมาใช้ใน AI โดยผิดกฎหมาย PDPA มีโทษแยกต่างหากอย่างไรบ้าง?"
        },
        a: [
          {
            en: "Administrative fines up to THB 5,000,000, civil compensation + punitive damages up to 2x actual damage, and criminal penalties for sensitive data misuse.",
            th: "โทษปรับทางปกครองสูงสุด 5,000,000 บาท ค่าสินไหมทางแพ่ง+ค่าเสียหายเชิงลงโทษสูงสุด 2 เท่า และโทษอาญาสำหรับข้อมูลอ่อนไหว"
          },
          {
            en: "Zero penalties if EU AI Act fines were already paid.",
            th: "ไม่มีโทษใดๆ หากจ่ายค่าปรับ EU AI Act ไปแล้ว"
          },
          {
            en: "Maximum fine of THB 1,000 only.",
            th: "ปรับสูงสุดเพียง 1,000 บาทเท่านั้น"
          },
          {
            en: "Only a temporary website suspension for 1 hour.",
            th: "ระงับเว็บไซต์ชั่วคราวเพียง 1 ชั่วโมง"
          }
        ],
        c: 0,
        why: {
          en: "PDPA Sections 77–90 impose cumulative liability: THB 5M administrative fines, 2x civil punitive damages, and criminal sanctions for sensitive data.",
          th: "PDPA มาตรา 77–90 กำหนดความรับผิดแยกต่างหากทั้งโทษปรับปกครองสูงสุด 5 ล้านบาท ค่าสินไหม+ค่าเสียหายเชิงลงโทษ 2 เท่า และโทษอาญา"
        }
      }
    ]
  };

  export const finalExamByChapter: Record<number, readonly BiQuestion[]> = {
    1: [
      ...warmUpByChapter[1],
      {
        q: {
          en: "If an organization outside Thailand uses AI to track user behavior inside Thailand AND sells outputs in the EU, which frameworks apply?",
          th: "หากองค์กรนอกประเทศไทยใช้ AI ติดตามพฤติกรรมผู้ใช้ในไทย และนำผลลัพธ์ของ AI ไปใช้ในสหภาพยุโรปด้วย กฎหมายใดบ้างที่อาจมีผลบังคับ?"
        },
        a: [
          {
            en: "Both the EU AI Act (Article 2) and Thailand's PDPA (Section 5).",
            th: "ทั้ง EU AI Act (Article 2) และ PDPA ของไทย (มาตรา 5) เนื่องจากต่างมีขอบเขตบังคับใช้นอกอาณาเขต"
          },
          {
            en: "Neither law applies outside its own physical territory.",
            th: "ไม่เข้าข่ายกฎหมายใดเลยนอกเขตประเทศ"
          },
          {
            en: "Only EU AI Act applies; PDPA stops at borders.",
            th: "เข้าข่ายเฉพาะ EU AI Act เท่านั้น PDPA ไม่มีผลนอกประเทศ"
          },
          {
            en: "Only copyright law applies.",
            th: "เข้าข่ายเฉพาะกฎหมายลิขสิทธิ์"
          }
        ],
        c: 0,
        why: {
          en: "Both EU AI Act Art. 2 and PDPA Sec. 5 carry extraterritorial reach.",
          th: "ทั้ง EU AI Act มาตรา 2 และ PDPA มาตรา 5 ต่างมีขอบเขตการบังคับใช้นอกอาณาเขต"
        }
      }
    ],
    2: [
      ...warmUpByChapter[2],
      {
        q: {
          en: "Which practice uses AI to evaluate people's social behavior over time and impose disproportionate detrimental treatment?",
          th: "แนวปฏิบัติใดที่ใช้ AI ประเมินพฤติกรรมทางสังคมของบุคคลแล้วนำไปสู่การตัดสิทธิหรือปฏิบัติอย่างไม่เป็นธรรม?"
        },
        a: [
          {
            en: "Social Scoring (prohibited under Article 5).",
            th: "Social Scoring (การให้คะแนนทางสังคม ซึ่งถูกห้ามเด็ดขาดตาม Article 5)"
          },
          {
            en: "Automated spell-checking.",
            th: "การตรวจคำผิดอัตโนมัติ"
          },
          {
            en: "Weather forecasting.",
            th: "การพยากรณ์อากาศ"
          },
          {
            en: "Medical X-ray calibration.",
            th: "การปรับเทียบเครื่องเอกซเรย์ทางการแพทย์"
          }
        ],
        c: 0,
        why: {
          en: "Social Scoring is strictly prohibited under Article 5.",
          th: "Social Scoring เป็นแนวปฏิบัติต้องห้ามเด็ดขาดตาม Article 5"
        }
      }
    ],
    3: [
      ...warmUpByChapter[3],
      {
        q: {
          en: "Which deployers of high-risk AI systems must conduct a Fundamental Rights Impact Assessment (Article 27) before deployment?",
          th: "ผู้ใช้งานระบบ (Deployers) ประเภทใดที่ต้องจัดทำการประเมินผลกระทบต่อสิทธิขั้นพื้นฐาน (FRIA — Article 27) ก่อนเปิดใช้ High-Risk AI?"
        },
        a: [
          {
            en: "Public bodies or private entities providing public services (and specified high-risk deployers).",
            th: "หน่วยงานของรัฐ หรือองค์กรเอกชนที่ให้บริการสาธารณะ (และกรณีสำคัญที่กฎหมายกำหนด)"
          },
          {
            en: "Only teenagers playing video games.",
            th: "เฉพาะเยาวชนที่เล่นวิดีโอเกม"
          },
          {
            en: "Only offline bakery cash registers.",
            th: "เฉพาะเครื่องคิดเงินร้านเบเกอรี่"
          },
          {
            en: "None; Article 27 is purely optional for governments.",
            th: "ไม่มีใครต้องทำ เพราะ Article 27 เป็นเพียงข้อแนะนำ"
          }
        ],
        c: 0,
        why: {
          en: "Article 27 requires public bodies and private entities providing public services to perform a Fundamental Rights Impact Assessment.",
          th: "Article 27 กำหนดให้หน่วยงานรัฐและเอกชนผู้ให้บริการสาธารณะต้องทำ FRIA ก่อนเริ่มใช้งานระบบ High-Risk AI"
        }
      }
    ],
    4: [
      ...warmUpByChapter[4],
      {
        q: {
          en: "When an evidently artistic, creative, or satirical work includes a deepfake, how does Article 50 adjust the disclosure duty?",
          th: "หากสื่อ Deepfake เป็นส่วนหนึ่งของงานศิลปะ งานสร้างสรรค์ หรือการเสียดสีที่เห็นได้ชัด Article 50 ผ่อนคลายหน้าที่เปิดเผยอย่างไร?"
        },
        a: [
          {
            en: "Disclosure is limited to revealing the existence of such generated content in an appropriate manner that does not hamper display or enjoyment.",
            th: "จำกัดเพียงการแจ้งให้ทราบว่ามีเนื้อหาที่สร้าง/ดัดแปลงโดย AI อยู่ ในลักษณะที่เหมาะสมและไม่รบกวนการรับชมหรืออรรถรสของผลงาน"
          },
          {
            en: "The artwork must be deleted completely from the internet.",
            th: "ต้องลบผลงานศิลปะนั้นออกจากอินเทอร์เน็ตทั้งหมด"
          },
          {
            en: "No disclosure of any kind is ever allowed.",
            th: "ห้ามไม่ให้มีการแจ้งเตือนใดๆ ทั้งสิ้น"
          },
          {
            en: "Artists must display a full-screen siren every 5 seconds.",
            th: "ต้องเปิดเสียงไซเรนเตือนเต็มหน้าจอทุก 5 วินาที"
          }
        ],
        c: 0,
        why: {
          en: "Article 50 protects creative freedom by allowing proportionate disclosure that does not hamper the work.",
          th: "Article 50 คุ้มครองเสรีภาพทางศิลปะ โดยให้แจ้งอย่างเหมาะสมที่ไม่กระทบการแสดงหรือการรับชมผลงาน"
        }
      }
    ],
    5: [
      ...warmUpByChapter[5],
      {
        q: {
          en: "Which GPAI models qualify for targeted exemptions from Article 53(1)(a) & (b) documentation duties?",
          th: "โมเดล GPAI แบบใดที่ได้รับข้อยกเว้นเฉพาะบางส่วนจากหน้าที่จัดทำเอกสารตาม Article 53(1)(a) และ (b)?"
        },
        a: [
          {
            en: "Open-source GPAI models released under free and open-source licenses with public parameters, UNLESS they pose systemic risk.",
            th: "โมเดล GPAI โอเพนซอร์สที่เปิดเผยพารามิเตอร์ต่อสาธารณะภายใต้สัญญาอนุญาตเสรี ยกเว้นกรณีที่เป็นโมเดลที่มีความเสี่ยงเชิงระบบ"
          },
          {
            en: "All proprietary models sold over $10M.",
            th: "โมเดลปิดเชิงพาณิชย์ที่มีมูลค่าเกิน 10 ล้านดอลลาร์ทั้งหมด"
          },
          {
            en: "Models with systemic risk exceeding 10²⁵ FLOPs.",
            th: "โมเดลที่มีความเสี่ยงเชิงระบบเกิน 10²⁵ FLOPs"
          },
          {
            en: "Every model built outside Europe.",
            th: "โมเดลทุกตัวที่พัฒนาอยู่นอกทวีปยุโรป"
          }
        ],
        c: 0,
        why: {
          en: "Free/open-source GPAI models with public parameters have targeted exemptions from (a)&(b), except when they carry systemic risk (and still obey copyright & training summary).",
          th: "โมเดลโอเพนซอร์สที่เปิดเผยพารามิเตอร์ได้รับข้อยกเว้นเฉพาะข้อ (a)–(b) หากไม่มีความเสี่ยงเชิงระบบ แต่ยังต้องทำตามเรื่องลิขสิทธิ์และสรุปข้อมูลฝึก"
        }
      }
    ],
    6: [
      ...warmUpByChapter[6],
      {
        q: {
          en: "If a prospective provider submits a real-world testing plan under Article 60(4)(a)-(b), what happens after 30 days if national law allows tacit approval?",
          th: "ตาม Article 60(4)(a)-(b) เมื่อยื่นแผนทดสอบในสภาพแวดล้อมจริงต่อหน่วยงานกำกับดูแล จะเกิดผลอย่างไรหลังครบ 30 วัน (หากกฎหมายชาติไม่ห้าม)?"
        },
        a: [
          {
            en: "Tacit approval takes effect after 30 days unless national law provides otherwise.",
            th: "ถือว่าได้รับความเห็นชอบโดยปริยาย (Tacit Approval) หลังครบ 30 วัน เว้นแต่กฎหมายภายในประเทศกำหนดไว้เป็นอย่างอื่น"
          },
          {
            en: "The company is automatically fined EUR 15,000,000.",
            th: "บริษัทจะถูกปรับ 15,000,000 ยูโรโดยอัตโนมัติ"
          },
          {
            en: "The AI system is banned permanently.",
            th: "ระบบ AI จะถูกสั่งห้ามถาวร"
          },
          {
            en: "Testing can last 50 years.",
            th: "สามารถทดสอบต่อได้นานถึง 50 ปี"
          }
        ],
        c: 0,
        why: {
          en: "Article 60(4)(a)-(b) provides approval or tacit approval after 30 days unless national law specifies otherwise.",
          th: "Article 60(4)(a)-(b) กำหนดให้ขออนุมัติล่วงหน้า หรือถือว่าอนุมัติโดยปริยายหลัง 30 วันเว้นแต่กฎหมายชาติกำหนดต่างออกไป"
        }
      }
    ],
    7: [
      ...warmUpByChapter[7],
      {
        q: {
          en: "In the European Artificial Intelligence Board (Articles 65–66), what are the roles of the AI Office and EDPS?",
          th: "ในคณะกรรมการ European Artificial Intelligence Board (Articles 65–66) หน่วยงาน AI Office และ EDPS มีบทบาทอย่างไร?"
        },
        a: [
          {
            en: "Each Member State has one voting representative; the AI Office participates without voting rights and the EDPS attends as an observer.",
            th: "รัฐสมาชิกประเทศละ 1 เสียง ส่วน AI Office เข้าร่วมโดยไม่มีสิทธิออกเสียง และ EDPS เข้าร่วมในฐานะผู้สังเกตการณ์ (Observer)"
          },
          {
            en: "Only the EDPS can vote on every issue.",
            th: "มีเพียง EDPS เท่านั้นที่มีสิทธิออกเสียงลงคะแนน"
          },
          {
            en: "Member States are excluded from the AI Board.",
            th: "รัฐสมาชิกไม่มีตัวแทนอยู่ใน AI Board"
          },
          {
            en: "The AI Board consists only of start-up founders.",
            th: "AI Board ประกอบด้วยผู้ก่อตั้งสตาร์ทอัพเท่านั้น"
          }
        ],
        c: 0,
        why: {
          en: "Articles 65–66 balance Member State representation with non-voting AI Office participation and EDPS observer oversight.",
          th: "Articles 65–66 กำหนดองค์ประกอบของ AI Board จากผู้แทนรัฐสมาชิก โดย AI Office ไม่มีสิทธิโหวต และ EDPS ร่วมสังเกตการณ์"
        }
      }
    ],
    8: [
      ...warmUpByChapter[8],
      {
        q: {
          en: "What administrative fine applies to GPAI model infringements under Article 101 or other core obligations under Article 99(4)?",
          th: "ความผิดของโมเดล GPAI ตาม Article 101 หรือการฝ่าฝืนหน้าที่หลักอื่นๆ ตาม Article 99(4) มีเพดานโทษปรับทางปกครองสูงสุดเท่าใด?"
        },
        a: [
          {
            en: "Up to EUR 15,000,000 or up to 3% of total worldwide annual turnover.",
            th: "สูงสุด 15,000,000 ยูโร หรือสูงสุด 3% ของรายได้รวมทั่วโลกต่อปี"
          },
          {
            en: "Up to EUR 35,000,000 or 7% turnover.",
            th: "สูงสุด 35,000,000 ยูโร หรือ 7% ของรายได้รวมทั่วโลก"
          },
          {
            en: "Up to EUR 7,500,000 or 1% turnover.",
            th: "สูงสุด 7,500,000 ยูโร หรือ 1% ของรายได้รวมทั่วโลก"
          },
          {
            en: "Up to EUR 1,000 flat fee.",
            th: "ปรับคงที่สูงสุด 1,000 ยูโร"
          }
        ],
        c: 0,
        why: {
          en: "Both Article 99(4) (core obligations) and Article 101 (GPAI infringements) carry administrative fines up to EUR 15,000,000 or 3% worldwide turnover.",
          th: "ทั้ง Article 99(4) และ Article 101 กำหนดเพดานค่าปรับสูงสุดที่ 15,000,000 ยูโร หรือ 3% ของรายได้รวมทั่วโลกต่อปี"
        }
      }
    ]
  };

  export const getStageQuestions = (chapter: number, stagePosition: number, limit = 10): Question[] => {
    const isFinalExam = stagePosition === LearningHausRules.quiz.stagesPerChapter - 1;
    const bank = isFinalExam
      ? finalExamByChapter[chapter] || warmUpByChapter[chapter]
      : warmUpByChapter[chapter];
    if (bank && bank.length > 0) {
      const converted = bank.map((q, idx) => toQuestion(q, chapter * 5 + idx + stagePosition + 1));
      const offset = stagePosition % converted.length;
      const rotated = [...converted.slice(offset), ...converted.slice(0, offset)];
      return rotated.slice(0, Math.min(limit, rotated.length));
    }
    const chapterPromptList = chapterPrompts[chapter] || [];
    if (chapter === 1) {
      return [...chapterOne.slice(stagePosition), ...chapterOne.slice(0, stagePosition)].slice(0, limit);
    }
    return chapterPromptList.map((pair, position) => buildQuestion(pair, position, stagePosition)).slice(0, limit);
  };
}

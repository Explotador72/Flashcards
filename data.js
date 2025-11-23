// data.js
const flashcardsData = [
  // Notación de Lewis
    { question: "¿Cuál es el primer paso para dibujar la notación de Lewis?", answer: "Contar los electrones disponibles" },
    { question: "¿Cómo se calcula el número de enlaces en Lewis?", answer: "NE = (electrones que quieren los átomos - electrones totales) / 2" },
    { question: "¿Qué se hace después de calcular los enlaces en Lewis?", answer: "Identificar los átomos del medio" },
    { question: "¿Cuál es el último paso para completar una estructura de Lewis?", answer: "Completar con los electrones restantes alrededor de los átomos" },

    // Tipos de enlace
    { question: "¿Qué enlace tiene diferencia de electronegatividad mayor a 1.7?", answer: "Enlace iónico" },
    { question: "¿Qué enlace implica compartición de electrones?", answer: "Enlace covalente" },
    { question: "¿Qué es un enlace metálico?", answer: "Unión química entre átomos de metales con electrones de valencia formando un 'mar de electrones'" },
    { question: "¿Qué son las fuerzas de van der Waals?", answer: "Fuerzas más débiles que los enlaces químicos, entre moléculas" },

    // Geometría molecular (TRPEV)
    { question: "Según TRPEV, ¿qué determina la geometría molecular?", answer: "La repulsión entre pares de electrones de valencia" },
    { question: "Número estérico = ?", answer: "Número de átomos unidos + pares no enlazantes" },
    { question: "Orden de repulsión entre pares y enlaces", answer: "Par no enlazante > triple > doble > sencillo" },
    { question: "Geometría para 2 grupos de electrones", answer: "Lineal (180°)" },
    { question: "Geometría para 3 grupos de electrones", answer: "Trigonal planar (120°)" },
    { question: "Geometría para 4 grupos de electrones", answer: "Tetraédrica (109.5°)" },

    // Hibridación (TEV)
    { question: "Hibridación sp", answer: "Lineal (2 orbitales)" },
    { question: "Hibridación sp²", answer: "Trigonal planar (3 orbitales)" },
    { question: "Hibridación sp³", answer: "Tetraédrica (4 orbitales)" },

    // Enlace sigma y pi
    { question: "¿Qué es un enlace sigma (σ)?", answer: "Solapamiento frontal de orbitales, densidad electrónica sobre el eje internuclear" },
    { question: "¿Qué es un enlace pi (π)?", answer: "Solapamiento lateral de orbitales, densidad electrónica fuera del eje internuclear" },

    // Multiplicidad
    { question: "Número de enlaces en un enlace sencillo", answer: "1 σ" },
    { question: "Número de enlaces en un enlace doble", answer: "1 σ + 1 π" },
    { question: "Número de enlaces en un enlace triple", answer: "1 σ + 2 π" },

    // Termodinámica
    { question: "1ª Ley de la termodinámica", answer: "La energía total de un sistema aislado se conserva, ΔU = Q - W" },
    { question: "2ª Ley de la termodinámica", answer: "La entropía de un sistema aislado nunca disminuye: ΔS ≥ 0" },
    { question: "3ª Ley de la termodinámica", answer: "No es posible alcanzar T = 0 K; entropía tiende a mínimo constante" },

    // Equilibrio químico
    { question: "Condición para que un proceso esté en equilibrio", answer: "ΔG = 0; coexistencia de reactivos y productos" },
    { question: "Efecto de aumentar volumen en gases según Le Châtelier", answer: "El equilibrio se desplaza hacia el lado con más moles de gas" },
    { question: "Efecto de un catalizador en el equilibrio", answer: "Acelera la reacción directa e inversa sin cambiar la posición del equilibrio" },

    // Cinética y catálisis
    { question: "Qué es la energía de activación", answer: "Energía mínima que deben tener las partículas para reaccionar" },
    { question: "Qué es un intermediario de reacción", answer: "Especies transitorias que se forman durante la reacción" },
    { question: "Qué es el estado de transición", answer: "Punto de máxima energía durante la reacción" },

    // Aromaticidad
    { question: "Condiciones para que un compuesto sea aromático", answer: "1) Anillo cíclico 2) Plano 3) Conjugación π 4) Cumple regla de Hückel (4n+2 electrones π)" },

    // Fuerzas intermoleculares
    { question: "Fuerzas dipolo-dipolo", answer: "Interacciones entre moléculas polares" },
    { question: "Puente de hidrógeno", answer: "Interacción entre H unido a electronegativo y par de electrones libres en otro átomo electronegativo" },

    // Propiedades físicas
    { question: "Relación polaridad y punto de ebullición", answer: "Más polar → mayor punto de ebullición (si masas similares)" },

    // Absorción y emisión
    { question: "Diferencia entre fluorescencia y fosforescencia", answer: "Fluorescencia: emisión inmediata; Fosforescencia: emisión lenta tras estímulo" }
    { question: "Primer paso en notación de Lewis", answer: "Contar los electrones disponibles" },
    { question: "Cómo calcular el número de enlaces", answer: "NE = (electrones que quieren los átomos - electrones totales) / 2" },
    { question: "Qué hacer después de calcular los enlaces", answer: "Identificar los átomos del medio" },
    { question: "Cómo completar la estructura de Lewis", answer: "Unir átomos con enlaces simples y luego completar con electrones restantes" },
    { question: "Qué es la ruptura heterolítica", answer: "Más electronegativo gana los electrones" },
    { question: "Qué es la ruptura homolítica", answer: "Cada átomo se lleva la mitad de electrones" },
    { question: "Octeto expandido", answer: "Solamente átomos de tercer periodo o más abajo pueden tener más de 8 electrones" },

    // Tipos de enlace
    { question: "Fuerzas más débiles que los enlaces", answer: "Fuerzas de van der Waals" },
    { question: "Enlace iónico diferencia EN", answer: "Mayor a 1.7" },
    { question: "Enlace covalente diferencia EN", answer: "Menor a 1.7" },
    { question: "Qué ocurre en enlace iónico", answer: "Transferencia de electrones de metal a no metal" },
    { question: "Qué es electrovalencia", answer: "Número de electrones intercambiados en un enlace iónico" },
    { question: "Qué es índice de coordinación", answer: "Número de iones de carga opuesta alrededor de un ion" },
    { question: "Características sólidos iónicos", answer: "Red cristalina, frágiles, duros, solubles en disolventes polares" },
    { question: "Qué es enlace metálico", answer: "Electrones de valencia se mueven libremente formando un 'mar de electrones'" },
    { question: "Propiedades enlace metálico", answer: "Alta densidad, conductor, dúctil, maleable, brillante" },
    { question: "Enlace covalente polar", answer: "Electrones compartidos de forma desigual, momento dipolar" },
    { question: "Enlace covalente apolar", answer: "Electrones compartidos equitativamente" },

    // Geometría molecular (TRPEV)
    { question: "Base TRPEV", answer: "Repulsión entre pares de electrones de valencia" },
    { question: "Número estérico", answer: "Átomos unidos + pares no enlazantes" },
    { question: "Orden repulsión", answer: "Par no enlazante > triple > doble > sencillo" },
    { question: "Geometría 2 grupos", answer: "Lineal (180°)" },
    { question: "Geometría 3 grupos", answer: "Trigonal planar (120°)" },
    { question: "Geometría 4 grupos", answer: "Tetraédrica (109.5°)" },
    { question: "Geometría 3 grupos + 1 par libre", answer: "Pirámide trigonal (107°)" },
    { question: "Geometría 2 grupos + 2 pares libres", answer: "Angular (104.5°)" },

    // Hibridación (TEV)
    { question: "Hibridación sp", answer: "Lineal, 2 orbitales" },
    { question: "Hibridación sp²", answer: "Trigonal planar, 3 orbitales" },
    { question: "Hibridación sp³", answer: "Tetraédrica, 4 orbitales" },

    // Enlace sigma y pi
    { question: "Enlace sigma", answer: "Solapamiento frontal de orbitales" },
    { question: "Enlace pi", answer: "Solapamiento lateral de orbitales" },

    // Multiplicidad
    { question: "Enlace sencillo", answer: "1 sigma" },
    { question: "Enlace doble", answer: "1 sigma + 1 pi" },
    { question: "Enlace triple", answer: "1 sigma + 2 pi" },

    // Teoría de orbitales moleculares (TOM)
    { question: "Base TOM", answer: "Combinación de orbitales atómicos para formar orbitales moleculares" },
    { question: "Qué es HOMO", answer: "Orbital molecular ocupado de mayor energía" },
    { question: "Qué es LUMO", answer: "Orbital molecular desocupado de menor energía" },
    { question: "Qué indica el orden de enlace", answer: "Número de enlaces entre dos átomos, determina estabilidad" },
    { question: "He₂ es estable?", answer: "No, OE=0" },
    { question: "He₂⁺ es estable?", answer: "Sí, OE=0.5" },

    // Termodinámica
    { question: "1ª Ley", answer: "ΔU = Q - W, energía total se conserva" },
    { question: "2ª Ley", answer: "ΔS ≥ 0, entropía de sistema aislado no disminuye" },
    { question: "3ª Ley", answer: "T=0 K inalcanzable, entropía tiende a mínimo" },
    { question: "Entalpía de formación", answer: "Variación de entalpía al formar 1 mol de compuesto desde sus elementos en estado estándar" },
    { question: "Ley de Hess", answer: "ΔH total depende solo de estado inicial y final, no del camino" },
    { question: "ΔG < 0", answer: "Reacción espontánea (exergónica)" },
    { question: "ΔG > 0", answer: "Reacción no espontánea (endergónica)" },
    { question: "ΔG = 0", answer: "Sistema en equilibrio" },

    // Cinética y teoría de colisiones
    { question: "Qué es velocidad de reacción", answer: "Cambio de concentración de reactivos por unidad de tiempo" },
    { question: "Qué es energía de activación", answer: "Energía mínima necesaria para que ocurra la reacción" },
    { question: "Qué es estado de transición", answer: "Punto de máxima energía durante la reacción" },
    { question: "Qué es intermediario de reacción", answer: "Especie transitoria formada durante la reacción" },
    { question: "Qué hace un catalizador", answer: "Aumenta velocidad sin consumirse, ofreciendo camino alternativo de menor energía" },

    // Equilibrio químico
    { question: "Condición equilibrio químico", answer: "ΔG=0, coexistencia reactivos/productos" },
    { question: "Constante de equilibrio Kc", answer: "Relaciona concentraciones de productos y reactivos en equilibrio" },
    { question: "Efecto aumento de presión en gases", answer: "Equilibrio se desplaza hacia el lado con menos moles de gas" },
    { question: "Efecto aumento de temperatura en endotérmica", answer: "Desplaza equilibrio hacia el lado directo (endotérmico)" },

    // Fuerzas intermoleculares
    { question: "Qué es puente de hidrógeno", answer: "Interacción entre H unido a electronegativo y par de electrones libres en otro electronegativo" },
    { question: "Fuerzas dipolo-dipolo", answer: "Interacción entre moléculas polares" },
    { question: "Dipolo inducido-dipolo instantáneo", answer: "Interacción entre moléculas apolares por fluctuación temporal de electrones" },

    // Propiedades físicas
    { question: "Relación polaridad y solubilidad", answer: "Polares se disuelven en polares, apolares en apolares" },
    { question: "Relación polaridad y punto de ebullición", answer: "Mayor polaridad → mayor punto de ebullición (si masas similares)" },

    // Absorción y emisión
    { question: "Fluorescencia", answer: "Emisión inmediata mientras dure el estímulo" },
    { question: "Fosforescencia", answer: "Emisión lenta después del estímulo" },

    // Aromaticidad
    { question: "Regla de Hückel", answer: "Compuesto cíclico, plano y con 4n+2 electrones π" },
    { question: "Qué es aromaticidad", answer: "Estabilidad excepcional de compuestos cíclicos y planos por conjugación de electrones" },

    // Momento dipolar
    { question: "Qué ocurre si los dipolos se cancelan", answer: "La molécula es apolar" },

    // Condiciones puente de hidrógeno
    { question: "Qué condiciones necesita un puente de hidrógeno", answer: "H unido a átomo central y otro átomo con par de electrones libres" }
];

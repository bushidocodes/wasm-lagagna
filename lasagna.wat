(module
    (global $EXPECTED_MINUTES_IN_OVEN (export "EXPECTED_MINUTES_IN_OVEN") i32 (i32.const 40))
    ;; The amount of minutes it takes to prepare a single layer
    (global $PREPARATION_MINUTES_PER_LAYER i32 (i32.const 2))

    ;; Determines the amount of minutes the lasagna still needs to remain in the oven to be properly prepared.
    (func $remainingMinutesInOven (export "remainingMinutesInOven") (param $actualMinutesInOven i32) (result i32)
        (i32.sub (global.get $EXPECTED_MINUTES_IN_OVEN) (local.get $actualMinutesInOven))
    )

    ;; Given a number of layers, determines the total preparation time.
    (func $preparationTimeInMinutes (export "preparationTimeInMinutes") (param $numberOfLayers i32) (result i32)
        (i32.mul (global.get $PREPARATION_MINUTES_PER_LAYER) (local.get $numberOfLayers))
    )

    ;; Calculates the total working time. That is, the time to prepare all the layers
    ;; of lasagna, and the time already spent in the oven.
    (func $totalTimeInMinutes (export "totalTimeInMinutes") (param $numberOfLayers i32) (param $actualMinutesInOven i32) (result i32)
        (i32.add 
            (call $preparationTimeInMinutes (local.get $numberOfLayers))
            (local.get $actualMinutesInOven)
        )
    )
)
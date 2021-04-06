
// @debug-block-start
xxx
// @debug-block-start
asdfasdf
// @debug-block-end

// Comment 123

// Comment Abc1

function a() {

    // @debug-block-start
    let a = 1;
    let b = 2;

    // @IIFE-for-debug
    () => {
        test
    };
}

function p() {
    (function abc() {

        // @IIFE-for-debug
        ()=>{}

    })
}


// @IIFE-for-debug
() => {
    a = 11;
};


// Comment Abc2

// Comment Abc3
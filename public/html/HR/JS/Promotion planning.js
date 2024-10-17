let progressValue1 = 0;
        let progressValue2 = 0;
        let progressValue3 = 0;
        let progressValue4 = 0;

        const progressText1 = document.getElementById('progress-text1');
        const progressText2 = document.getElementById('progress-text2');
        const progressText3 = document.getElementById('progress-text3');
        const progressText4 = document.getElementById('progress-text4');

        // Function to update the first progress (up to 15)
        const updateProgress1 = () => {
            if (progressValue1 <= 15) {
                progressText1.textContent = progressValue1 + '%';
                progressValue1++;
            } else {
                clearInterval(progressInterval1); // Stop when 15 is reached
            }
        };

        // Function to update the second progress (up to 18)
        const updateProgress2 = () => {
            if (progressValue2 <= 18) {
                progressText2.textContent = progressValue2 + '%';
                progressValue2++;
            } else {
                clearInterval(progressInterval2); // Stop when 18 is reached
            }
        };

        // Function to update the third progress (up to 55)
        const updateProgress3 = () => {
            if (progressValue3 <= 55) {
                progressText3.textContent = progressValue3 + '%';
                progressValue3++;
            } else {
                clearInterval(progressInterval3); // Stop when 55 is reached
            }
        };

        // Function to update the fourth progress (up to 10)
        const updateProgress4 = () => {
            if (progressValue4 <= 10) {
                progressText4.textContent = progressValue4 + '%';
                progressValue4++;
            } else {
                clearInterval(progressInterval4); // Stop when 10 is reached
            }
        };

        // Set intervals for each progress update
        const progressInterval1 = setInterval(updateProgress1, 20); // Adjust timing to control speed
        const progressInterval2 = setInterval(updateProgress2, 20); // Adjust timing to control speed
        const progressInterval3 = setInterval(updateProgress3, 20); // Adjust timing to control speed
        const progressInterval4 = setInterval(updateProgress4, 20); // Adjust timing to control speed

   
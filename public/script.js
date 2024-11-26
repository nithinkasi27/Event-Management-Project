document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');

    const districtsByState = {
        "Andhra Pradesh": ["Amaravati", "Visakhapatnam", "Vijayawada","chittor","kakinada","East godavari","West godavari","Tirupathi"],
        "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro","Upper Siang","East Siang","Lohit"],
        "Assam": ["Dispur", "Guwahati", "Jorhat"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur"],
        "Chhattigarh": ["Raipur", "Bilaspur", "Durg"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama"],
        "Gujarat": ["Gandhinagar", "Ahmedabad", "Surat"],
        "Haryana": ["Chandigarh", "Faridabad", "Gurgaon"],
        "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
        "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Manipur": ["Imphal", "Churachandpur", "Thoubal"],
        "Meghalaya": ["Shillong", "Tura", "Jowai"],
        "Mizoram": ["Aizawl", "Lunglei", "Saiha"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
        "Odisha": ["Bhubaneshwar", "Cuttack", "Puri"],
        "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
        "Sikkim": ["Gangtok", "Geyzing", "Namchi"],
        "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore"],
        "Telangana": ["Hyderabad","Khammam", "Warangal", "Nizamabad","Adilabad","Peddapalli","Siddipet","Jangaon","Hanumakonda","Suryapet","Nalgonda","Nagarkurnool","Wanaparthy"],
        "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
        "West Bengal": ["Kolkata", "Darjeeling", "Siliguri"]
    };

    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        const districts = districtsByState[selectedState] || [];

        // Clear previous options
        districtSelect.innerHTML = '<option value="">Select District</option>';

        // Populate districts based on selected state
        districts.forEach(function(district) {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Set the min attribute for the date inputs to today's date
    document.getElementById('eventStartDate').setAttribute('min', today);
    document.getElementById('eventEndDate').setAttribute('min', today);

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        let valid = true;

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const eventStartDate = document.getElementById('eventStartDate').value;
        const eventEndDate = document.getElementById('eventEndDate').value;
        const state = document.getElementById('state').value;
        const district = document.getElementById('district').value;
        const location = document.getElementById('location').value.trim();
        const participantCount = document.getElementById('participantCount').value;
        const budget = document.getElementById('budget').value;

        // Clear previous error messages
        form.querySelectorAll('.error').forEach(error => error.remove());

        // Basic field presence validation
        if (!firstName || !lastName || !email || !phoneNumber || !eventStartDate || !eventEndDate || !state || !district || !location || !participantCount || !budget) {
            valid = false;
            showAlert('All fields are required.');
        }

        // Validate email
        if (!validEmail(email)) {
            valid = false;
            showAlert('Invalid email address. Please ensure it includes an "@" symbol and a domain.');
        }

        // Validate phone number
        if (!/^\d{10}$/.test(phoneNumber)) {
            valid = false;
            showAlert('Phone number must be exactly 10 digits.');
        }

        // Validate dates
        if (!validateDates(eventStartDate, eventEndDate)) {
            valid = false;
        }

        if (valid) {
            // Redirect to thankyou.html if everything is valid
            window.location.href = 'thankyou.html';
        }
    });

    function validateDates(startDate, endDate) {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        if (startDate < today) {
            showAlert('Event start date cannot be in the past. Please select a valid date.');
            return false;
        }

        if (endDate < today) {
            showAlert('Event end date cannot be in the past. Please select a valid date.');
            return false;
        }

        if (startDate && endDate && startDate > endDate) {
            showAlert('Event end date cannot be earlier than the event start date. Please correct the dates.');
            return false;
        }

        return true; // If all date validations pass
    }

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showAlert(message) {
        alert(message); // Show alert with the error message
    }
});

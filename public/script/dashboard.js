document.addEventListener('DOMContentLoaded', async () => {
    const dashboardStats = document.getElementById('dashboard-stats');
    const companiesList = document.getElementById('companies-list');
    const addCompanyBtn = document.getElementById('add-company-btn');
    const companyModalElement = document.getElementById('company-modal');
    const reminderModalElement = document.getElementById('reminder-modal');
    const applicationModalElement = document.getElementById('application-modal');
    // const addApplicationForm = document.getElementById('add-application-form'); // Ensure this element exists
    const selectedCompanyIdInput = document.getElementById('selected-company-id'); // Ensure this element exists

    // Ensure modal elements exist before initializing them
    if (!companyModalElement || !reminderModalElement || !applicationModalElement) {
        console.error('One or more modal elements are missing in the DOM.');
        return;
    }

    let companyModal, reminderModal, applicationModal;

    try {
        companyModal = new bootstrap.Modal(companyModalElement);
        reminderModal = new bootstrap.Modal(reminderModalElement);
        applicationModal = new bootstrap.Modal(applicationModalElement);
    } catch (error) {
        console.error('Error initializing modals:', error.message);
        return;
    }

    const companyForm = document.getElementById('company-form');
    const companyIdInput = document.getElementById('company-id');
    const companyNameInput = document.getElementById('company-name');
    const companyContactInput = document.getElementById('company-contact');
    const companySizeInput = document.getElementById('company-size');
    const companyIndustryInput = document.getElementById('company-industry');
    const companyNotesInput = document.getElementById('company-notes');
    const remindersList = document.getElementById('reminders-list');
    const addReminderBtn = document.getElementById('add-reminder-btn');
    const reminderForm = document.getElementById('reminder-form');
    const reminderDateInput = document.getElementById('reminder-date');
    const applicationIdInput = document.getElementById('application-id');
    const applicationForm = document.getElementById('application-form');
    const jobTitleInput = document.getElementById('job-title');
    const applicationDateInput = document.getElementById('application-date');
    const statusInput = document.getElementById('status');
    const notesInput = document.getElementById('notes');

    let statsChartInstance; // Declare a variable to store the chart instance

    // Fix aria-hidden warning by ensuring modal focus management
    applicationModalElement.addEventListener('hidden.bs.modal', () => {
        // Remove focus from any element inside the modal
        if (document.activeElement && applicationModalElement.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    });

    // Ensure proper initialization of the modal
    try {
        applicationModal = new bootstrap.Modal(applicationModalElement, {
            backdrop: 'static', // Prevent closing the modal by clicking outside
            keyboard: true,     // Allow closing the modal with the Escape key
        });
    } catch (error) {
        console.error('Error initializing application modal:', error.message);
        return;
    }

    // Fix aria-hidden warning by ensuring modal focus management
    applicationModalElement.addEventListener('hidden.bs.modal', () => {
        // Move focus to the "Add Application" button when the modal is closed
        const addApplicationBtn = document.getElementById('add-application-btn');
        if (addApplicationBtn) {
            addApplicationBtn.focus();
        }
    });

    // Fetch and display dashboard stats
    try {
        const statsResponse = await fetch('http://localhost:3000/api/v1/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Retrieve token from localStorage
            },
        });

        if (!statsResponse.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        const { stats } = await statsResponse.json();
        dashboardStats.innerHTML = `
            <div class="row">
                <div class="col-md-2">
                    <div class="card text-white" style="background-color:hsl(192, 88.60%, 37.80%);"> <!-- Light blue for Total Applications -->
                        <div class="card-body">
                            <h5 class="card-title">Total Applications</h5>
                            <p class="card-text">${stats.totalApplications}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-white" style="background-color: #007bff;"> <!-- Blue for Applied -->
                        <div class="card-body">
                            <h5 class="card-title">Applied</h5>
                            <p class="card-text">${stats.applied}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-white" style="background-color: #ffc107;"> <!-- Yellow for Interviewed -->
                        <div class="card-body">
                            <h5 class="card-title">Interviewed</h5>
                            <p class="card-text">${stats.interviewed}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-white" style="background-color: #28a745;"> <!-- Green for Offered -->
                        <div class="card-body">
                            <h5 class="card-title">Offered</h5>
                            <p class="card-text">${stats.offered}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-white" style="background-color: #dc3545;"> <!-- Red for Rejected -->
                        <div class="card-body">
                            <h5 class="card-title">Rejected</h5>
                            <p class="card-text">${stats.rejected}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err.message);
        alert('Error loading dashboard stats');
    }

    // Fetch and display companies
    async function loadCompanies() {
        try {
            const companiesResponse = await fetch('/api/v1/companies', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!companiesResponse.ok) {
                throw new Error('Failed to fetch companies');
            }

            const companies = await companiesResponse.json();
 
           companiesList.innerHTML = companies.map((company, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${company.name}</td>
                    <td>${company.contactDetails}</td>
                    <td>${company.size}</td>
                    <td>${company.industry}</td>
                    <td>${company.notes}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editCompany('${company._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCompany('${company._id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            alert('Error loading companies');
        }
    }

    // Add/Edit Company
    companyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const _id = companyIdInput.value;
        const name = companyNameInput.value;
        const contactDetails = companyContactInput.value;
        const size = companySizeInput.value;
        const industry = companyIndustryInput.value;
        const notes = companyNotesInput.value;

        try {
            const method = _id ? 'PUT' : 'POST';
            const url = _id ? `/api/v1/companies/${_id}` : '/api/v1/companies';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
                body: JSON.stringify({ name, contactDetails, size, industry, notes }),
            });

            if (!response.ok) {
                throw new Error('Failed to save company');
            }

            alert('Company saved successfully');
            companyModal.hide();
            loadCompanies();
        } catch (err) {
            console.error(err.message);
            alert('Error saving company');
        }
    });

    // Edit Company
    window.editCompany = async (_id) => {
        try {
            const response = await fetch(`/api/v1/companies/${_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch company details');
            }

            const company = await response.json();
            companyIdInput.value = company._id;
            companyNameInput.value = company.name;
            companyContactInput.value = company.contactDetails;
            companySizeInput.value = company.size;
            companyIndustryInput.value = company.industry;
            companyNotesInput.value = company.notes;

            companyModal.show();
        } catch (err) {
            console.error(err.message);
            alert('Error fetching company details');
        }
    };

    // Delete Company
    window.deleteCompany = async (_id) => {
        if (!confirm('Are you sure you want to delete this company?')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/companies/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete company');
            }

            alert('Company deleted successfully');
            loadCompanies();
        } catch (err) {
            console.error(err.message);
            alert('Error deleting company');
        }
    };

    // Load companies on page load
    loadCompanies();

    // Open modal for adding a new company
    addCompanyBtn.addEventListener('click', () => {
        companyIdInput.value = '';
        companyNameInput.value = '';
        companyContactInput.value = '';
        companySizeInput.value = '';
        companyIndustryInput.value = '';
        companyNotesInput.value = '';
        companyModal.show();
    });

    // Fetch and display reminders
    async function loadReminders() {
        try {
            const remindersResponse = await fetch('http://localhost:3000/api/v1/reminders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!remindersResponse.ok) {
                throw new Error('Failed to fetch reminders');
            }

            const reminders = await remindersResponse.json();
            remindersList.innerHTML = reminders.map((reminder, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${reminder.reminderDate}</td>
                    <td>${reminder.applicationId}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteReminder('${reminder._id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error(err.message);
            alert('Error loading reminders');
        }
    }

    // Add Reminder
    reminderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const reminderDate = reminderDateInput.value;
        const applicationId = applicationIdInput.value;

        // Validate input fields
        if (!reminderDate || !applicationId) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/v1/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
                body: JSON.stringify({ reminderDate, applicationId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save reminder');
            }

            alert('Reminder saved successfully');
            reminderModal.hide();
            loadReminders();
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    });

    // Delete Reminder
    window.deleteReminder = async (_id) => {
        if (!confirm('Are you sure you want to delete this reminder?')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/reminders/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in the request
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete reminder');
            }

            alert('Reminder deleted successfully');
            loadReminders(); // Reload reminders after successful deletion
        } catch (err) {
            console.error('Failed to delete reminder:', err.message);
            alert('Error deleting reminder: ' + err.message);
        }
    };

    // Load reminders on page load
    loadReminders();

    // Fetch and populate application IDs for reminders
    async function loadApplicationsForReminders() {
        try {
            const response = await fetch('/api/v1/applications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }

            const applications = await response.json();

            // Check if there are valid applications
            if (applications.length === 0) {
                alert('No applications available. Please add an application first.');
                return;
            }

            // Populate the dropdown with valid application IDs
            applicationIdInput.innerHTML = applications.map(app => `
                <option value="${app._id}">${app.jobTitle} (ID: ${app._id})</option>
            `).join('');
        } catch (err) {
            console.error(err.message);
            alert('Error loading applications for reminders');
        }
    }

    // Open modal for adding a new reminder
    addReminderBtn.addEventListener('click', () => {
        reminderDateInput.value = '';
        applicationIdInput.innerHTML = ''; // Clear previous options
        loadApplicationsForReminders(); // Load valid application IDs
        reminderModal.show();
    });

    // Fetch and display application stats
    async function loadApplicationStats() {
        try {
            const response = await fetch('/api/v1/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch application stats');
            }

            const { stats } = await response.json();
            const canvas = document.getElementById('statsChart');
            if (!canvas) {
                console.error('Canvas element for stats chart not found');
                return;
            }

            const ctx = canvas.getContext('2d');

            // Destroy the existing chart instance if it exists
            if (statsChartInstance) {
                statsChartInstance.destroy();
            }

            // Create a new chart instance
            statsChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Applied', 'Interviewed', 'Offered', 'Rejected'],
                    datasets: [{
                        data: [stats.applied, stats.interviewed, stats.offered, stats.rejected],
                        backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545'],
                    }],
                },
            });
        } catch (err) {
            console.error('Error loading application stats:', err.message);
            alert('Error loading application stats');
        }
    }

    // Call loadApplicationStats on page load
    loadApplicationStats();

    // Call this function when opening the "Add Application" modal
    document.getElementById('add-application-btn').addEventListener('click', () => {
        jobTitleInput.value = '';
        applicationDateInput.value = '';
        statusInput.value = 'Applied';
        notesInput.value = '';
        applicationModal.show();
    });

    let isSubmitting = false; // Prevent duplicate submissions

    // Ensure the "Add Application" form is responding
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (isSubmitting) {
            console.warn('Form is already being submitted. Please wait.');
            return; // Prevent duplicate submissions
        }

        isSubmitting = true; // Set the flag to true to indicate submission is in progress

        const formData = {
            jobTitle: jobTitleInput.value.trim(),
            applicationDate: applicationDateInput.value.trim(),
            status: statusInput.value.trim(),
            notes: notesInput.value.trim(),
        };

        // Validate required fields
        if (!formData.jobTitle || !formData.applicationDate || !formData.status) {
            alert('All fields are required.');
            isSubmitting = false; // Reset the flag
            return;
        }

        try {
            const response = await fetch('/api/v1/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
                body: JSON.stringify(formData), // Send the form data as JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save application');
            }

            alert('Application saved successfully');
            applicationModal.hide(); // Hide the modal after successful submission
            loadApplications(); // Reload the applications list
        } catch (err) {
            console.error('Error saving application:', err.message);
            alert('Error saving application: ' + err.message);
        } finally {
            isSubmitting = false; // Reset the flag after submission is complete
        }
    });

    // Edit Application
    window.editApplication = async (_id) => {
        try {
            const response = await fetch(`/api/v1/applications/${_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch application details');
            }

            const application = await response.json();
            jobTitleInput.value = application.jobTitle;
            applicationDateInput.value = new Date(application.applicationDate).toISOString().split('T')[0];
            statusInput.value = application.status;
            notesInput.value = application.notes || '';

            console.log('Editing Application.');
            applicationModal.show();
        } catch (err) {
            console.error(err.message);
            alert('Error fetching application details');
        }
    };

    async function loadApplications() {
        try {
            const response = await fetch('/api/v1/applications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if required
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }

            const applications = await response.json();

            const applicationsList = document.getElementById('applications-list');
            applicationsList.innerHTML = applications.map((application, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${application.jobTitle}</td>
                    <td>${new Date(application.applicationDate).toLocaleDateString()}</td>
                    <td>${application.status}</td>
                    <td>${application.notes || 'N/A'}</td>
                    <td>
                        ${application.filePath 
                            ? `<a href="/${application.filePath}" target="_blank" class="btn btn-sm btn-info">View</a>` 
                            : 'No Attachment'}
                    </td>
                    <td>
                       <button class="btn btn-warning btn-sm" onclick="editApplication('${application._id}')">Edit</button>
                       <button class="btn btn-danger btn-sm" onclick="deleteApplication('${application._id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Error loading applications:', err.message);
            alert('Error loading applications');
        }
    }

    // Delete Application
    window.deleteApplication = async (_id) => {
        if (!confirm('Are you sure you want to delete this application?')) {
            return;
        }

        try {
            const response = await fetch(`/api/v1/applications/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete application');
            }

            alert('Application deleted successfully');
            loadApplications();
        } catch (err) {
            console.error('Error deleting application');
            alert('Error deleting application');
        }
    };

    // Load applications on page load
    loadApplications();
});
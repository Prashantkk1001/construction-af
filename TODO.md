# RK Constructions Admin Frontend - TODO List

## Phase 1: Authentication & Routing Fixes
- [ ] Add JWT interceptor to API service for automatic token attachment
- [ ] Fix token key consistency (use "adminToken" everywhere)
- [ ] Add login route to App.tsx
- [ ] Wrap admin routes with ProtectedRoute component
- [ ] Update logout redirect to /login

## Phase 2: Layout & Navigation Updates
- [ ] Update Sidebar title to "RK Constructions – Admin Panel"
- [ ] Update sidebar menu items: Dashboard, Home, About, Services, Projects, Contact, Enquiries
- [ ] Move logout button to bottom of sidebar
- [ ] Fix sidebar links to use correct /admin/* paths
- [ ] Remove logout from Topbar

## Phase 3: Dashboard Implementation
- [ ] Create summary cards for Total Services, Total Projects, Total Enquiries
- [ ] Add API calls to fetch counts dynamically
- [ ] Style dashboard with proper layout

## Phase 4: Home Content Manager
- [ ] Create HomeEditor component with fields: Hero title, Description, Banner images, Contact number
- [ ] Implement image upload functionality
- [ ] Add save functionality with API integration

## Phase 5: About Content Manager
- [ ] Update AboutEditor with specific fields: Company introduction, Construction journey, Experience (number), Total projects count (number)
- [ ] Implement proper form layout and validation

## Phase 6: Services Manager
- [ ] Create ServiceList component with table/card display
- [ ] Create AddService component with Title, Description, Image upload
- [ ] Create EditService component
- [ ] Implement delete functionality
- [ ] Add API integration for CRUD operations

## Phase 7: Projects Manager
- [ ] Create ProjectList component with category labels and image previews
- [ ] Create AddProject component with category selection and image uploads
- [ ] Create EditProject component
- [ ] Implement delete functionality
- [ ] Add API integration for CRUD operations

## Phase 8: Contact Settings
- [ ] Create ContactSettings component with Address, Phone, Email, Social media URLs
- [ ] Implement static social media icons with editable URLs
- [ ] Add save functionality

## Phase 9: Enquiry List
- [ ] Create EnquiryList component with table display
- [ ] Show Name, Email, Phone, Message, Date fields
- [ ] Make it read-only

## Phase 10: Final Integration & Testing
- [ ] Update App.tsx with all routes
- [ ] Test authentication flow
- [ ] Test all CRUD operations
- [ ] Ensure responsive design
- [ ] Add loading states and error handling

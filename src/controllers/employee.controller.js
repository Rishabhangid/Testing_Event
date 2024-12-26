const Employee = require('../models/employee.model.js');



// Create new employee
const createEmployee = async (req, res) => {
    try {
        const { name, email, position, salary } = req.body;
        const newEmployee = await Employee.create({ name, email, position, salary });
        res.status(201).json(newEmployee);
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            return res.status(400).json({ message: 'Validation error', errors: err.errors });
        }
        res.status(500).json({ message: 'Error creating employee', error: err });
    }
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 20; 
        const offset = (page - 1) * limit;

        const employees = await Employee.findAll({
            limit: limit,   
            offset: offset,  
            order: [['createdAt', 'DESC']], 
        });

        // Get the total count of employees
        const totalEmployees = await Employee.count();

        // Send the response with employees and pagination info
        res.status(200).json({
            employees,
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: page,
        });
    } catch (err) {
        console.log(err, "---------------err---------------");
        res.status(500).json({ message: 'Error fetching employees', error: err });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({data:employee,message:"Updated"});
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee', error: err });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, position, salary } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.update({ name, email, position, salary });
        res.status(200).json({data:employee,message:"Updated"});
    } catch (err) {
        res.status(500).json({ message: 'Error updating employee', error: err });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.destroy();
        res.status(200).json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};

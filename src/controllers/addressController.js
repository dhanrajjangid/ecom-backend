import Address from '../models/Address.js'

export const createAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body });
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

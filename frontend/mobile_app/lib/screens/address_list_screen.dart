import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/society.dart';
import '../models/address.dart';
import '../widgets/address/address_card.dart';
import '../widgets/address/delete_address_modal.dart';
import '../widgets/common/empty_state.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'add_address_screen.dart';
import 'main_navigation_screen.dart';

class AddressListScreen extends StatefulWidget {
  final Society society;

  const AddressListScreen({
    super.key,
    required this.society,
  });

  @override
  State<AddressListScreen> createState() => _AddressListScreenState();
}

class _AddressListScreenState extends State<AddressListScreen> {
  late List<Address> _addresses;

  @override
  void initState() {
    super.initState();
    _addresses = [
      Address(
        id: 'addr_01',
        label: 'Home',
        flatNo: 'Flat 402',
        buildingBlock: 'Block A',
        streetArea: 'Main Road',
        city: widget.society.city,
        postalCode: widget.society.postalCode,
        landmark: 'Near main gate',
        isDefault: true,
      ),
      Address(
        id: 'addr_02',
        label: 'Other',
        flatNo: 'Flat 102',
        buildingBlock: 'Block B',
        streetArea: 'Main Road',
        city: widget.society.city,
        postalCode: widget.society.postalCode,
        isDefault: false,
      ),
    ];
  }

  void _handleSetDefault(String addressId) {
    setState(() {
      _addresses = _addresses.map((a) {
        return a.copyWith(isDefault: a.id == addressId);
      }).toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('✓ Default address updated')),
    );
  }

  void _handleDeleteAddress(Address address) {
    if (address.isDefault && _addresses.length > 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Set another address as default before deleting this address.'),
          backgroundColor: AppColors.warningAmber,
        ),
      );
      return;
    }

    DeleteAddressModal.show(
      context,
      onConfirmDelete: () {
        setState(() {
          _addresses.removeWhere((a) => a.id == address.id);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✓ Address deleted')),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('My Addresses', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Addresses List / Empty State
              Expanded(
                child: _addresses.isEmpty
                    ? EmptyState(
                        icon: Icons.home_rounded,
                        title: 'No addresses yet',
                        description: 'Add your service address to start booking services.',
                        actionText: '+ ADD ADDRESS',
                        onAction: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => AddAddressScreen(society: widget.society),
                            ),
                          );
                        },
                      )
                    : ListView.builder(
                        itemCount: _addresses.length,
                        itemBuilder: (context, index) {
                          final addr = _addresses[index];
                          return AddressCard(
                            address: addr,
                            societyName: widget.society.name,
                            onEdit: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => AddAddressScreen(
                                    society: widget.society,
                                    existingAddress: addr,
                                  ),
                                ),
                              );
                            },
                            onDelete: () => _handleDeleteAddress(addr),
                            onSetDefault: () => _handleSetDefault(addr.id),
                          );
                        },
                      ),
              ),

              // + ADD NEW ADDRESS Button
              SecondaryButton(
                text: '+ ADD NEW ADDRESS',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => AddAddressScreen(society: widget.society),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Primary CTA: CONTINUE TO HOME
              PrimaryButton(
                text: 'CONTINUE TO HOME',
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

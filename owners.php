<?php

// Sample data (use this if database is not set up yet)
$owners = [
    [
        'id' => 1,
        'name' => 'John Smith',
        'position' => 'Building Manager',
        'email' => 'john.smith@moonstrata.com.au',
        'phone' => '+61 2 0000 0001',
        'image' => 'images/owners/john-smith.jpg',
        'bio' => 'With over 15 years of experience in property management, John ensures smooth operations and resident satisfaction.'
    ],
    [
        'id' => 2,
        'name' => 'Sarah Johnson',
        'position' => 'Assistant Manager',
        'email' => 'sarah.johnson@moonstrata.com.au',
        'phone' => '+61 2 0000 0002',
        'image' => 'images/owners/sarah-johnson.jpg',
        'bio' => 'Sarah specializes in community relations and maintenance coordination, bringing 10 years of strata management expertise.'
    ],
    [
        'id' => 3,
        'name' => 'Michael Chen',
        'position' => 'Maintenance Supervisor',
        'email' => 'michael.chen@moonstrata.com.au',
        'phone' => '+61 2 0000 0003',
        'image' => 'images/owners/michael-chen.jpg',
        'bio' => 'Michael oversees all maintenance operations with a focus on preventive maintenance and quick response times.'
    ]
];

// Use database results if available, otherwise use sample data
$displayOwners = $result && $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : $owners;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Building Owners - Moon Strata Management</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .owner-card {
            transition: transform 0.2s;
        }
        .owner-card:hover {
            transform: translateY(-5px);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-xl font-semibold text-gray-800">.moon</span>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="index.php" class="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="community.php" class="text-gray-600 hover:text-gray-900">Community</a>
                    <a href="services.php" class="text-gray-600 hover:text-gray-900">Services</a>
                    <a href="rules.php" class="text-gray-600 hover:text-gray-900">Rules</a>
                    <a href="owners.php" class="text-gray-600 hover:text-gray-900 font-medium">Owners</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Building Owners</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($displayOwners as $owner): ?>
                <div class="bg-white rounded-lg shadow-md overflow-hidden owner-card">
                    <div class="h-64 relative">
                        <img 
                            src="<?php echo htmlspecialchars($owner['image']); ?>" 
                            alt="<?php echo htmlspecialchars($owner['name']); ?>"
                            class="w-full h-full object-cover"
                        >
                    </div>
                    <div class="p-6">
                        <h2 class="text-xl font-semibold text-gray-800 mb-2">
                            <?php echo htmlspecialchars($owner['name']); ?>
                        </h2>
                        <p class="text-blue-600 font-medium mb-4">
                            <?php echo htmlspecialchars($owner['position']); ?>
                        </p>
                        <p class="text-gray-600 mb-4">
                            <?php echo htmlspecialchars($owner['bio']); ?>
                        </p>
                        <div class="space-y-2">
                            <a 
                                href="mailto:<?php echo htmlspecialchars($owner['email']); ?>"
                                class="flex items-center text-gray-600 hover:text-blue-600"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <?php echo htmlspecialchars($owner['email']); ?>
                            </a>
                            <a 
                                href="tel:<?php echo htmlspecialchars($owner['phone']); ?>"
                                class="flex items-center text-gray-600 hover:text-blue-600"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <?php echo htmlspecialchars($owner['phone']); ?>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p class="text-center text-gray-500">
                © <?php echo date('Y'); ?> Moon Strata Management. All rights reserved.
            </p>
        </div>
    </footer>
</body>
</html>

<?php

?> 